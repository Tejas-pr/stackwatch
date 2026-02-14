// here I need to pick the websites from q and ping and put the status into the DB(bulk).
import axios from "axios";
import { ensureConsumerGroup, XAckBulk, XReadGroup, redisOptions, getValue, setValue } from "@repo/redis-queue";
import { insertWebsiteTick } from "@repo/timeseries-database/timeseries";
import { Queue } from "bullmq";
import fs from "fs";
import { prisma } from "@repo/database";

const queueName = process.env.QUEUENAME || "stackwatch-email-queue";
const emailQueue = new Queue(queueName, { connection: redisOptions });

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;
const emailIntervalTime = Number(process.env.EMAILINTERVALTIME || 900);

if (!REGION_ID) {
    throw new Error("Region not provided");
}

if (!WORKER_ID) {
    throw new Error("Worker not provided");
}

async function getEmail(websiteId: string) {
    const cacheKey = `email_cache:${websiteId}`;
    const cachedEmail = await getValue(cacheKey);
    if (cachedEmail) return cachedEmail;

    const website = await prisma.website.findUnique({
        where: {
            id: websiteId
        },
        include: {
            user: true
        }
    })
    
    const email = website?.user.email;

    if (email) {
        await setValue(cacheKey, email, 60 * 60 * 24);
    }

    return email;
}

async function main() {
    await ensureConsumerGroup(REGION_ID);

    while (1) {
        const response = await XReadGroup(REGION_ID, WORKER_ID);
        if (!response) {
            continue;
        }

        // hit the website and check status.
        const promises = response.map(({ message }) => fetchWebsite(message.url, message.id));
        await Promise.all(promises);

        XAckBulk(REGION_ID, response.map(({ id }) => id));
    }
}

async function fetchWebsite(url: string, website_id: string) {
    try {
        return new Promise<void>((resolve, reject) => {
            const start_time = Date.now();

            axios.get(url)
                .then(async () => {
                    const end_time = Date.now();
                    const response_time_ms = end_time - start_time;
                    await insertWebsiteTick({
                        websiteId: website_id,
                        regionId: REGION_ID,
                        responseTime: response_time_ms,
                        status: "Up"
                    })
                    resolve();
                })
                .catch(async () => {
                    const end_time = Date.now();
                    const response_time_ms = end_time - start_time;
                    await insertWebsiteTick({
                        websiteId: website_id,
                        regionId: REGION_ID,
                        responseTime: response_time_ms,
                        status: "Down"
                    })

                    // Check if we already sent an email for this website recently
                    const dedupeKey = `alert:timestamp:v2:${website_id}`;
                    const existingAlert = await getValue(dedupeKey);

                    if (existingAlert !== "sent") {
                        const template = await fs.promises.readFile("./email.template.html", "utf-8");
                        const html = template.replace(/{{url}}/g, url).replace(/{{time}}/g, new Date().toLocaleString());
                        
                        const email = await getEmail(website_id);
                        if (email) {
                            await emailQueue.add("email", {
                                to: email,
                                subject: `Alert: ${url} is Down`,
                                body: `Your website ${url} is currently down. Checked at ${new Date().toISOString()}`,
                                html
                            });
                            console.log(`Alert email sent to ${email} for ${url}`);
                        } else {
                            console.log(`No email found for website ${website_id}`);
                        }

                        await setValue(dedupeKey, "sent", emailIntervalTime);
                    }

                    resolve();
                })
        })
    } catch (e) {
        console.log(e)
    }
}

main();