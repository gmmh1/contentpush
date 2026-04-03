import { Router } from "express";
import { auth, requireRole } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export const adminRouter = Router();

adminRouter.get("/users", auth, requireRole("admin"), async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  return res.json(users);
});

adminRouter.patch("/users/:id/role", auth, requireRole("admin"), async (req, res) => {
  const role = String(req.body.role || "").trim();
  if (!role) {
    return res.status(400).json({ error: "role is required" });
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: { id: true, email: true, role: true }
  });

  return res.json(user);
});
