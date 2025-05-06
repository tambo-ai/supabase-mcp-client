import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import cors from "cors";
import express from "express";
import { proxyServer } from "mcp-proxy";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: /^http:\/\/localhost:\d+$/, // Allows any localhost port
    credentials: true,
  })
);
const server = new Server(
  {
    name: "supabase-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

let transport: SSEServerTransport | null = null;
//setup supabase mcp server and proxy so we can use SSE transport

const mcpClient = new Client({ name: "mcp", version: "1.0.0" });
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
proxyServer({
  server,
  client: mcpClient,
  serverCapabilities: {},
});

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  transport = new SSEServerTransport("/messages", res);
  server.connect(transport);
});

app.post("/messages", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    console.error("Message received without sessionId");
    res.status(400).json({ error: "sessionId is required" });
    return;
  }
  if (transport) {
    transport.handlePostMessage(req, res, req.body);
  } else {
    res.status(500).send("SSE transport not initialized");
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
