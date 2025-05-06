import { getTransport } from "@/lib/transport";

export async function POST(request: Request) {
  const transport = getTransport();
  if (transport) {
    await transport.handlePostMessage(request);
    return new Response(null, { status: 200 });
  }
  return new Response("SSE transport not initialized", { status: 500 });
}
