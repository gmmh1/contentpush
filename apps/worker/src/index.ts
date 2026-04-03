import dotenv from "dotenv";
import { Worker } from "bullmq";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: "../../.env" });

const prisma = new PrismaClient();
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null
});

new Worker(
  "publish-post",
  async job => {
    const postId = String(job.data.postId);
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return;
    }

    // Keep posting logic safe by default until real platform credentials are configured.
    console.log(`Simulated publish: ${post.platform} | ${post.content.slice(0, 80)}`);

    await prisma.post.update({
      where: { id: postId },
      data: {
        status: "published",
        publishedAt: new Date()
      }
    });
  },
  { connection: redis }
);

console.log("Worker listening on queue: publish-post");
