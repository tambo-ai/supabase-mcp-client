"use client";

import { MessageInput } from "@/components/ui/message-input";
import { ThreadContent } from "@/components/ui/thread-content";
import { cn } from "@/lib/utils";
import { useTambo } from "@tambo-ai/react";
import * as React from "react";
import { useEffect, useRef } from "react";

/**
 * Props for the MessageThreadFull component
 * @interface
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
export interface MessageThreadFullProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional context key for the thread */
  contextKey?: string;
}

/**
 * A full-screen chat thread component with message history, input, and suggestions
 * @component
 * @example
 * ```tsx
 * <MessageThreadFull
 *   contextKey="my-thread"
 *   className="custom-styles"
 * />
 * ```
 */
export const MessageThreadFull = React.forwardRef<
  HTMLDivElement,
  MessageThreadFullProps
>(({ className, contextKey, ...props }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { thread } = useTambo();

  useEffect(() => {
    if (scrollContainerRef.current && thread?.messages?.length) {
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [thread?.messages]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col bg-white overflow-hidden bg-background",
        "h-full",
        className
      )}
      {...props}
    >
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <ThreadContent className="py-4" />
      </div>
      <div className="p-4">
        <MessageInput contextKey={contextKey} />
      </div>
    </div>
  );
});
MessageThreadFull.displayName = "MessageThreadFull";
