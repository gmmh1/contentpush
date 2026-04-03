"use client";

import { useState } from "react";
import { Nav } from "../../components/nav";
import { apiFetch } from "../../lib/api";

export default function BillingPage() {
  const [error, setError] = useState("");

  async function subscribe() {
    setError("");
    try {
      const data = await apiFetch<{ url: string }>("/billing/checkout-session", {
        method: "POST"
      });
      window.location.href = data.url;
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <Nav />
      <section className="card">
        <h1>Billing</h1>
        <p>Stripe checkout session starts your monthly subscription.</p>
        <button className="btn" onClick={subscribe}>
          Start Subscription
        </button>
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
      </section>
    </main>
  );
}
