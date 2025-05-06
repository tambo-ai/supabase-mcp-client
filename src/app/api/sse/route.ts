import { getTransport, setTransport } from "@/lib/transport";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const server = new Server({
  name: "mcp",
  version: "1.0.0",
  capabilities: {},
});

export async function GET(request: Request, response: Response) {
  let transport = getTransport();
  if (!transport) {
    transport = new SSEServerTransport("/messages");
    setTransport(transport);
    server.connect(transport);
  }
}
