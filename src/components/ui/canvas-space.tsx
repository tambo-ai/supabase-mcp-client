"use client";
import { useTambo } from "@tambo-ai/react";
import { useEffect, useState } from "react";
export const CanvasSpace = () => {
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
          {lastRenderedComponent ? (
            lastRenderedComponent
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <p>ready</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
