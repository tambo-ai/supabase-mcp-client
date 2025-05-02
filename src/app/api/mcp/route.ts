import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { NextResponse } from "next/server";

let mcpClient: Client | null = null;

async function initializeMCP() {
  if (!mcpClient) {
    mcpClient = new Client({ name: "mcp", version: "1.0.0" });
    const transport = new StdioClientTransport({
      command: "npx",
      args: [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        process.env.SUPABASE_ACCESS_TOKEN!,
      ],
    });
    await mcpClient.connect(transport);
  }
  return mcpClient;
}

export async function GET() {
  try {
    const mcp = await initializeMCP();
    const tools = await mcp.listTools();
    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Error initializing MCP:", error);
    return NextResponse.json(
      { error: "Failed to initialize MCP" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const mcp = await initializeMCP();
    const body = await request.json();
    const { tool, args } = body;
    const result = await mcp.callTool({ name: tool, arguments: args });
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in MCP operation:", error);
    return NextResponse.json(
      { error: "Failed to perform MCP operation" },
      { status: 500 }
    );
  }
}
