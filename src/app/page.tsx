"use client";
import { CanvasSpace } from "@/components/ui/canvas-space";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { initMCPTools } from "@/services/mcp-service";
import { useTambo } from "@tambo-ai/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { registerTools } = useTambo();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeMCP = async () => {
      // Initialize MCP server and fetch tool definitions
      try {
        setIsInitializing(true);
        const tools = await initMCPTools();
        registerTools(tools);
      } catch (error) {
        console.error("Failed to initialize MCP:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeMCP();
  }, [registerTools]);

  return (
    <div className="flex h-screen py-6">
      <div className="flex flex-col h-full bg-white">
        <div className="w-[500px] min-w-[400px] h-full p-8">
          <MessageThreadFull contextKey="tambo-template" />
        </div>
      </div>

      <div className="flex-1 bg-white p-10">
        <CanvasSpace isInitializing={isInitializing} />
      </div>
    </div>
  );
}
