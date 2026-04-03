import { Queue } from "bullmq";
import { redis } from "./redis";

export const publishQueue = new Queue("publish-post", {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 1000
  }
});
