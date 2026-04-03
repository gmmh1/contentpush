import { Router } from "express";
import { auth, requireRole } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { publishQueue } from "../lib/queue";

export const postsRouter = Router();

postsRouter.get("/all", auth, requireRole("admin"), async (_req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" }
  });

  return res.json(posts);
});

postsRouter.get("/", auth, async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" }
  });

  return res.json(posts);
});

postsRouter.post("/", auth, async (req, res) => {
  const { content, platform, publishAt } = req.body as {
    content: string;
    platform: string;
    publishAt?: string;
  };

  if (!content || !platform) {
    return res.status(400).json({ error: "content and platform are required" });
  }

  const parsedPublishAt = publishAt ? new Date(publishAt) : null;
  const status = parsedPublishAt ? "scheduled" : "draft";

  const post = await prisma.post.create({
    data: {
      userId: req.userId!,
      content,
      platform,
      publishAt: parsedPublishAt,
      status,
      schedule: parsedPublishAt
        ? {
            create: {
              publishAt: parsedPublishAt
            }
          }
        : undefined
    }
  });

  if (parsedPublishAt) {
    await publishQueue.add(
      "publish",
      { postId: post.id },
      { delay: Math.max(0, parsedPublishAt.getTime() - Date.now()) }
    );
  }

  return res.status(201).json(post);
});
