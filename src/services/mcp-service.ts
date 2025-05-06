import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

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
    new URL("http://localhost:3003/sse")
  );
  await client.connect(transport);
  mcpClient = client;
  return client;
};

export const initMCPTools = async () => {
  try {
    const client = await initMCPClient();
    console.log("MCP client initialized");
    const tools = await client.listTools();
    console.log("MCP tools loaded:", tools);

    // return tools.map((tool: MCPTool) => ({
    //   name: tool.name,
    //   description: tool.description,
    //   tool: async (args: Record<string, unknown>) => {
    //     console.log("calling tool", tool.name);
    //     console.log("with args", args);
    //     try {
    //       const response = await fetch("/api/mcp", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           tool: tool.name,
    //           args,
    //         }),
    //       });
    //       if (!response.ok) {
    //         throw new Error(`Failed to execute tool ${tool.name}`);
    //       }
    //       return await response.json();
    //     } catch (error) {
    //       console.error(`Error executing tool ${tool.name}:`, error);
    //       throw error;
    //     }
    //   },
    //   toolSchema: z
    //     .function()
    //     .args(
    //       tool.inputSchema
    //         ? z.object(
    //             Object.fromEntries(
    //               Object.entries(tool.inputSchema.properties || {}).map(
    //                 ([key]) => [
    //                   key,
    //                   tool.inputSchema?.required?.includes(key)
    //                     ? z.any()
    //                     : z.any().optional(),
    //                 ]
    //               )
    //             )
    //           )
    //         : z.object({})
    //     )
    //     .returns(z.any()),
    // }));
  } catch (error) {
    console.error("Failed to initialize MCP:", error);
    return [];
  }
};
