export async function publishToPlatform(
  platform: string,
  content: string,
  token?: string
): Promise<{ externalId: string; status: string }> {
  // Stub adapter to keep MVP safe and platform-agnostic.
  // Replace with official SDK/API integrations per platform.
  const externalId = `${platform}-${Date.now()}`;
  const status = token ? "published" : "simulated";

  console.log(`[${platform}] ${status}:`, content.slice(0, 80));
  return { externalId, status };
}
