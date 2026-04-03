import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { auth, requireRole } from "./middleware/auth";
import { config } from "./config";

describe("auth and authorization middleware", () => {
  it("rejects missing token", async () => {
    const app = express();
    app.get("/secure", auth, (_req, res) => res.json({ ok: true }));

    const res = await request(app).get("/secure");
    expect(res.status).toBe(401);
  });

  it("allows valid token", async () => {
    const token = jwt.sign({ userId: "u1", role: "member" }, config.jwtSecret);
    const app = express();
    app.get("/secure", auth, (req, res) => res.json({ userId: req.userId }));

    const res = await request(app).get("/secure").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.userId).toBe("u1");
  });

  it("rejects unauthorized role", async () => {
    const token = jwt.sign({ userId: "u1", role: "member" }, config.jwtSecret);
    const app = express();
    app.get("/admin", auth, requireRole("admin"), (_req, res) => res.json({ ok: true }));

    const res = await request(app).get("/admin").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});
