// I need to create a service to pick the website and push to the q every 3 minutes.
import { prisma } from "@repo/database";
import { XAddBulk } from "@repo/redis-queue/redis-client";

const TIME_INTERVAL = process.env.TIME_INTERVAL || 3;

async function fetch() {
    const websites = await prisma.website.findMany({
        select: {
            url: true,
            id: true
        }
    });

    // add to queue
    XAddBulk(websites);
    console.log("pushed to queue");
}

fetch();

setInterval(() => {
    fetch();
    console.log("---------- time ----------");
}, 1000 * 60 * Number(TIME_INTERVAL));