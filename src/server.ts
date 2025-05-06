import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import * as dotenv from "dotenv";
import { proxyServer, startSSEServer } from "mcp-proxy";
dotenv.config({ path: ".env.local" });

//Proxy server for stdio MCP
const mcpClient = new Client({ name: "supabase-mcp", version: "1.0.0" });
const stdioTransport = new StdioClientTransport({
  command: "npx",
  args: [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--access-token",
    process.env.SUPABASE_ACCESS_TOKEN!,
  ],
});
await mcpClient.connect(stdioTransport);

const { close } = await startSSEServer({
  port: parseInt(process.env.NEXT_PUBLIC_SERVER_PORT!),
  endpoint: "/sse",
  createServer: async () => {
    const server = new Server(
      {
        name: "supabase-mcp",
        version: "1.0.0",
      },
      {
        capabilities: mcpClient.getServerCapabilities() as Record<
          string,
          unknown
        >,
      }
    );
    proxyServer({
      server,
      client: mcpClient,
      serverCapabilities: mcpClient.getServerCapabilities() as Record<
        string,
        unknown
      >,
    });
    return server;
  },
});
