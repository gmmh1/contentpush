import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { aiRouter } from "./routes/ai";
import { postsRouter } from "./routes/posts";
import { billingRouter } from "./routes/billing";
import { adminRouter } from "./routes/admin";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(healthRouter);
  app.use("/auth", authRouter);
  app.use("/ai", aiRouter);
  app.use("/posts", postsRouter);
  app.use("/billing", billingRouter);
  app.use("/admin", adminRouter);

  return app;
}
