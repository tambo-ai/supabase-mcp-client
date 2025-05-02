import { z } from "zod";

interface MCPTool {
  name: string;
  description: string;
  inputSchema?: {
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export const initMCPTools = async () => {
  try {
    const tools = await initMCP();
    console.log("MCP tools loaded:", tools);

    return tools.map((tool: MCPTool) => ({
      name: tool.name,
      description: tool.description,
      tool: async (args: Record<string, unknown>) => {
        console.log("calling tool", tool.name);
        console.log("with args", args);
        try {
          const response = await fetch("/api/mcp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tool: tool.name,
              args,
            }),
          });
          if (!response.ok) {
            throw new Error(`Failed to execute tool ${tool.name}`);
          }
          return await response.json();
        } catch (error) {
          console.error(`Error executing tool ${tool.name}:`, error);
          throw error;
        }
      },
      toolSchema: z
        .function()
        .args(
          tool.inputSchema
            ? z.object(
                Object.fromEntries(
                  Object.entries(tool.inputSchema.properties || {}).map(
                    ([key]) => [
                      key,
                      tool.inputSchema?.required?.includes(key)
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

const initMCP = async () => {
  console.log("initializing mcp");
  try {
    const response = await fetch("/api/mcp");
    if (!response.ok) {
      throw new Error("Failed to initialize MCP");
    }
    const data = await response.json();
    return data.tools.tools;
  } catch (error) {
    console.error("Error initializing MCP:", error);
    return [];
  }
};
