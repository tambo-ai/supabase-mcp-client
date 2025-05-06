import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { z } from "zod";

interface MCPTool {
  name: string;
  description: string;
  inputSchema?: {
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

let mcpClient: Client | null = null;

export const initMCPClient = async () => {
  if (mcpClient) {
    return mcpClient;
  }
  try {
    const client = new Client(
      {
        name: "example-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    const transport = new SSEClientTransport(
      new URL(`http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}/sse`)
    );

    await client.connect(transport);
    mcpClient = client;
    return client;
  } catch (error) {
    console.error("Failed to initialize MCP client:", error);
    throw error;
  }
};

export const initMCPTools = async () => {
  try {
    const client = await initMCPClient();
    console.log("MCP client initialized");
    const toolsResponse = await client.listTools();
    console.log("MCP tools loaded:", toolsResponse);
    const tools = toolsResponse.tools as MCPTool[];

    return tools.map((mcpTool: MCPTool) => ({
      name: mcpTool.name,
      description: mcpTool.description,
      tool: async (args: Record<string, unknown>) => {
        console.log("calling tool", mcpTool.name);
        console.log("with args", args);
        try {
          const response = await client.callTool({
            name: mcpTool.name,
            arguments: args,
          });
          return response;
        } catch (error) {
          console.error(`Error executing tool ${mcpTool.name}:`, error);
          throw error;
        }
      },
      toolSchema: z
        .function()
        .args(
          mcpTool.inputSchema
            ? z.object(
                Object.fromEntries(
                  Object.entries(mcpTool.inputSchema.properties || {}).map(
                    ([key]) => [
                      key,
                      mcpTool.inputSchema?.required?.includes(key)
                        ? z.any()
                        : z.any().optional(),
                    ]
                  )
                )
              )
            : z.object({})
        )
        .returns(z.any()),
    }));
  } catch (error) {
    console.error("Failed to initialize MCP:", error);
    return [];
  }
};
