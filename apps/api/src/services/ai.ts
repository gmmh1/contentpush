import OpenAI from "openai";
import { config } from "../config";

const openai = config.openAiKey ? new OpenAI({ apiKey: config.openAiKey }) : null;

export async function generateSocialContent(topic: string): Promise<string> {
  if (openai) {
    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You generate concise social media copy with CTA and hashtags."
        },
        {
          role: "user",
          content: `Create 3 variants for X, LinkedIn, and Instagram about: ${topic}`
        }
      ]
    });
    return result.choices[0]?.message?.content || "No AI output";
  }

  const ollamaResponse = await fetch(`${config.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.ollamaModel,
      prompt: `Create 3 social media post variants for: ${topic}`,
      stream: false
    })
  });

  if (!ollamaResponse.ok) {
    throw new Error("AI backend unavailable. Configure OPENAI_API_KEY or run Ollama.");
  }

  const payload = (await ollamaResponse.json()) as { response?: string };
  return payload.response || "No AI output";
}
