"use client";

import { FormEvent, useEffect, useState } from "react";
import { Nav } from "../../components/nav";
import { apiFetch } from "../../lib/api";

type Post = {
  id: string;
  content: string;
  platform: string;
  status: string;
  publishAt: string | null;
};

export default function SchedulerPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("Ship daily. Improve weekly.");
  const [platform, setPlatform] = useState("x");
  const [publishAt, setPublishAt] = useState("");
  const [error, setError] = useState("");

  async function loadPosts() {
    try {
      const data = await apiFetch<Post[]>("/posts");
      setPosts(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function createPost(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiFetch<Post>("/posts", {
        method: "POST",
        body: JSON.stringify({
          content,
          platform,
          publishAt: publishAt || null
        })
      });
      await loadPosts();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <main>
      <Nav />
      <section className="grid cols-2">
        <form className="card" onSubmit={createPost}>
          <h1>Schedule Post</h1>
          <p>Create draft or scheduled posts for worker publishing.</p>
          <textarea className="field" rows={5} value={content} onChange={e => setContent(e.target.value)} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <select className="field" value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="x">X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
            </select>
            <input
              className="field"
              type="datetime-local"
              value={publishAt}
              onChange={e => setPublishAt(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="btn" type="submit">
              Save
            </button>
          </div>
          {error && <p style={{ color: "#b91c1c" }}>{error}</p>}
        </form>

        <div className="card">
          <h2>Queued Posts</h2>
          {posts.length === 0 && <p>No posts yet.</p>}
          {posts.map(post => (
            <article key={post.id} className="card" style={{ marginTop: 8 }}>
              <strong>{post.platform.toUpperCase()}</strong>
              <p>{post.content}</p>
              <small>
                {post.status}
                {post.publishAt ? ` | ${new Date(post.publishAt).toLocaleString()}` : ""}
              </small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
