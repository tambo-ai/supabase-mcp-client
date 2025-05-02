"use client";
import { useTambo } from "@tambo-ai/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CanvasSpaceProps {
  isInitializing?: boolean;
}

export const CanvasSpace = ({ isInitializing = false }: CanvasSpaceProps) => {
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
              <span className="text-gray-500">ready</span>
            )
          )}
        </div>
      </div>
    </div>
  );
};
