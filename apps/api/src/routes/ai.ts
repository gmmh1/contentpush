import { Router } from "express";
import { auth } from "../middleware/auth";
import { generateSocialContent } from "../services/ai";

export const aiRouter = Router();

aiRouter.post("/generate", auth, async (req, res) => {
  const topic = String(req.body.topic || "").trim();
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const content = await generateSocialContent(topic);
    return res.json({ content });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});
