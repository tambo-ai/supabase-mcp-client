"use client";
import { CanvasSpace } from "@/components/ui/canvas-space";
import { MessageThreadFull } from "@/components/ui/message-thread-full";
import { TamboTool, useTambo } from "@tambo-ai/react";
import { useState } from "react";

export default function Home() {
  const { registerTools } = useTambo();
  const [isInitializing, setIsInitializing] = useState(true);
  const [tools, setTools] = useState<TamboTool[]>([]);

  return (
    <div className="flex h-screen py-6">
      <div className="flex flex-col h-full bg-white">
        <div className="w-[500px] min-w-[400px] h-full p-8">
          <MessageThreadFull contextKey="tambo-template" />
        </div>
      </div>

      <div className="flex-1 bg-white p-10">
        <CanvasSpace isInitializing={isInitializing} tools={tools} />
      </div>
    </div>
  );
}
