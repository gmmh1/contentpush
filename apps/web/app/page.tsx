"use client";

import { useState } from "react";
import { Nav } from "../components/nav";
import { apiFetch } from "../lib/api";

export default function DashboardPage() {
  const [email, setEmail] = useState("founder@example.com");
  const [password, setPassword] = useState("Password123");
  const [status, setStatus] = useState("");

  async function register() {
    try {
      await apiFetch<{ id: string; email: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setStatus("Registered. You can log in now.");
    } catch (err) {
      setStatus((err as Error).message);
    }
  }

  async function login() {
    try {
      const data = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("token", data.token);
      setStatus("Logged in. Token saved locally.");
    } catch (err) {
      setStatus((err as Error).message);
    }
  }

  return (
    <main>
      <Nav />
      <section className="grid cols-2">
        <article className="card">
          <h2>Auth Quickstart</h2>
          <p>Register and log in to enable generator, scheduler, and billing APIs.</p>
          <input className="field" value={email} onChange={e => setEmail(e.target.value)} />
          <input
            className="field"
            style={{ marginTop: 8 }}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn" onClick={register}>
              Register
            </button>
            <button className="btn" onClick={login}>
              Login
            </button>
          </div>
          {status && <p style={{ marginTop: 8 }}>{status}</p>}
        </article>
        <article className="card">
          <h2>AI Content</h2>
          <p>Generate platform-specific posts from one topic.</p>
        </article>
        <article className="card">
          <h2>Scheduler</h2>
          <p>Queue posts for auto publishing through the worker.</p>
        </article>
        <article className="card">
          <h2>Automation</h2>
          <p>Trigger-based social actions are schema-ready in backend.</p>
        </article>
        <article className="card">
          <h2>Billing</h2>
          <p>Stripe subscription checkout endpoint is integrated.</p>
        </article>
      </section>
    </main>
  );
}
