// I need to create a service to pick the website and push to the q every 3 minutes.
import { prisma } from "@repo/database";
import { XAddBulk } from "@repo/redis-queue/redis-client";

async function fetch() {
    const websites = await prisma.website.findMany({
        select: {
            url: true,
            id: true
        }
    });

    // add to queue
    XAddBulk(websites);
}

setTimeout(() => {
    fetch();
}, 3000);

fetch();