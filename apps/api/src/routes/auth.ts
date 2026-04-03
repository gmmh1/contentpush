import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { config } from "../config";
import { auth } from "../middleware/auth";

export const authRouter = Router();

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

authRouter.post("/register", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "admin" : "member";
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      role
    }
  });

  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

authRouter.post("/login", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: "7d"
  });
  return res.json({ token });
});

authRouter.get("/me", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: {
      id: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user);
});
