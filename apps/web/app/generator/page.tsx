"use client";

import { useState } from "react";
import { Nav } from "../../components/nav";
import { apiFetch } from "../../lib/api";

export default function GeneratorPage() {
  const [topic, setTopic] = useState("fitness for busy founders");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ content: string }>("/ai/generate", {
        method: "POST",
        body: JSON.stringify({ topic })
      });
      setResult(data.content);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Nav />
      <div className="card">
        <h1>AI Generator</h1>
        <p>Uses Ollama locally by default, with OpenAI fallback if configured.</p>
        <input className="field" value={topic} onChange={e => setTopic(e.target.value)} />
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        {result && (
          <pre
            className="card"
            style={{ marginTop: 12, whiteSpace: "pre-wrap", background: "#f8fbff" }}
          >
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
