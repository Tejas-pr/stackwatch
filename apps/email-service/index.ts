import { Worker, Job } from "bullmq";
import { redisOptions } from "@repo/redis-queue";
import { sendEmail } from "@repo/common/email";

const queueName = process.env.QUEUENAME || "stackwatch-email-queue";
interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

const worker = new Worker<EmailJobData>(
  queueName,
  async (job: Job<EmailJobData>) => {
    const { to, subject, body, html } = job.data;
    console.log(job.data);

    try {
      await sendEmail({
        to,
        subject,
        text: body,
        html,
      });

      console.log(`[EMAIL ✅] Job ${job.id} sent to ${to} | Attempt ${job.attemptsMade + 1}`);
    } catch (error) {
      console.error(
        `[EMAIL ❌] Job ${job.id} failed | Attempt ${job.attemptsMade + 1}`,
        error
      );
      throw error;
    }
  },
  {
    connection: redisOptions,
    concurrency: 5,
  }
);
