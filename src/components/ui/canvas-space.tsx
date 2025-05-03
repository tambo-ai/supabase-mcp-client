"use client";
import { useTambo } from "@tambo-ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CanvasSpaceProps {
  isInitializing?: boolean;
  tools?: any[];
}

export const CanvasSpace = ({
  isInitializing = false,
  tools = [],
}: CanvasSpaceProps) => {
  const { thread } = useTambo();
  const [lastRenderedComponent, setLastRenderedComponent] =
    useState<React.ReactNode | null>(null);

  useEffect(() => {
    const lastMessage = thread?.messages[thread?.messages.length - 1];
    if (lastMessage?.renderedComponent) {
      setLastRenderedComponent(lastMessage.renderedComponent);
    }
  }, [thread]);

  return (
    <div className="relative h-full rounded-lg border border-gray-200 bg-gray-200 overflow-y-auto">
      <div className="flex flex-col min-h-full w-full items-center p-6">
        <div className="my-auto w-full max-w-[700px]">
          {isInitializing ? (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Initializing MCP tools...</p>
            </div>
          ) : (
            lastRenderedComponent || (
              <div className="space-y-2 text-gray-700">
                <details className="cursor-pointer">
                  <summary className="hover:text-gray-900">
                    MCP tools ready
                  </summary>
                  <div className="mt-2 ml-4 space-y-1">
                    {tools.map((tool, index) => (
                      <div key={index}>{tool.name}</div>
                    ))}
                  </div>
                </details>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
