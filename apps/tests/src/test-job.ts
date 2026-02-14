import { Queue } from "bullmq";
import { redisOptions } from "@repo/redis-queue";

const emailQueue = new Queue("email-queue", {
    connection: redisOptions
});

const main = async () => {
    console.log("Adding job to email-queue...");
    await emailQueue.add("send-email", {
        to: "test@example.com",
        subject: "Hello from BullMQ",
        body: "This is a test email sent via Redis Queue!"
    });
    console.log("Job added!");
    
    // Allow some time for processing log to appear (if running in same process, but here we run separately)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await emailQueue.close();
};

main().catch(console.error);
