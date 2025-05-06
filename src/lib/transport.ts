import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

let transport: SSEServerTransport | null = null;

export function getTransport() {
  return transport;
}

export function setTransport(newTransport: SSEServerTransport) {
  transport = newTransport;
}
