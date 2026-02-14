// I need to create a service to pick the website and push to the q every 3 minutes.
import { prisma } from "@repo/database";
import { XAddBulk } from "@repo/redis-queue";

const TIME_INTERVAL = process.env.TIME_INTERVAL || 3;

const time = 1000 * 60 * Number(TIME_INTERVAL);
// 1000 * 60 * Number(TIME_INTERVAL)

async function fetch() {
  const websites = await prisma.website.findMany({
    select: {
      url: true,
      id: true,
    },
  });

  // add to queue
  XAddBulk(websites);
  console.log("pushed to queue");
}

setInterval(() => {
  fetch();
  console.log("---------- fetched ----------");
}, time);

fetch();
