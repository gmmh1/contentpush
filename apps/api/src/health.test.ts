import express from "express";
import request from "supertest";
import { healthRouter } from "./routes/health";

describe("health", () => {
  it("returns service health", async () => {
    const app = express();
    app.use(healthRouter);
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, service: "api" });
  });
});
