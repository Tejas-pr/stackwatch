// here I need to pick the websites from q and ping and put the status into the DB(bulk).
import axios from "axios";
import { ensureConsumerGroup, XAckBulk, XReadGroup } from "@repo/redis-queue/redis-client";
import { insertWebsiteTick } from "@repo/timeseries-database/timeseries";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
    throw new Error("Region not provided");
}

if (!WORKER_ID) {
    throw new Error("Worker not provided");
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
                    resolve();
                })
        })
    } catch (e) {
        console.log(e)
    }
}

main();