"use client";

import { createMarkdownComponents } from "@/components/ui/markdownComponents";
import { cn } from "@/lib/utils";
import type { TamboThreadMessage } from "@tambo-ai/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Loader2, X } from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";

/**
 * Represents a message component
 * @property {string} className - Optional className for custom styling
 * @property {VariantProps<typeof messageVariants>["variant"]} variant - Optional variant for custom styling
 */

const messageVariants = cva("flex", {
  variants: {
    variant: {
      default: "",
      solid: [
        "[&_div]:shadow",
        "[&_div]:shadow-zinc-900/10",
        "[&_div]:dark:shadow-zinc-900/20",
      ].join(" "),
      bordered: ["[&_div]:border", "[&_div]:border-border"].join(" "),
    },
    align: {
      user: "justify-end",
      assistant: "justify-start",
    },
  },
  defaultVariants: {
    variant: "default",
    align: "user",
  },
});

/**
 * Represents a bubble component
 * @property {string} role - Role of the bubble (user or assistant)
 * @property {string} className - Optional className for custom styling
 * @property {VariantProps<typeof bubbleVariants>["role"]} role - Role of the bubble (user or assistant)
 */
const bubbleVariants = cva(
  "relative inline-block rounded-lg px-3 py-2 text-[15px] leading-relaxed transition-all duration-200 font-medium max-w-full [&_p]:my-1 [&_ul]:-my-5 [&_ol]:-my-5",
  {
    variants: {
      role: {
        user: "bg-muted text-gray-700 hover:bg-muted/90",
        assistant: "text-foreground",
      },
    },
    defaultVariants: {
      role: "user",
    },
  }
);

/**
 * Gets the appropriate status message for a tool call
 *
 * This function extracts and formats status messages for tool calls based on
 * the current loading state and available status information.
 *
 * @param {TamboThreadMessage} message - The thread message object containing tool call data
 * @param {boolean | undefined} isLoading - Whether the tool call is currently in progress
 * @returns {string | null} The formatted status message or null if not a tool call
 */
function getToolStatusMessage(
  message: TamboThreadMessage,
  isLoading: boolean | undefined
) {
  const isToolCall = message.actionType === "tool_call";
  if (!isToolCall) return null;

  const toolCallMessage = isLoading
    ? `Calling ${message.toolCallRequest?.toolName ?? "tool"}`
    : `Called ${message.toolCallRequest?.toolName ?? "tool"}`;
  const toolStatusMessage = isLoading
    ? message.component?.statusMessage
    : message.component?.completionStatusMessage;
  return toolStatusMessage ?? toolCallMessage;
}

export interface MessageProps {
  role: "user" | "assistant";
  content: string | { type: string; text?: string }[];
  message: TamboThreadMessage;
  variant?: VariantProps<typeof messageVariants>["variant"];
  className?: string;
  isLoading?: boolean;
  isFinalMessage?: boolean;
}

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      className,
      role,
      content,
      variant,
      message,
      isLoading,
      isFinalMessage,
      ...props
    },
    ref
  ) => {
    const safeContent = React.useMemo(() => {
      if (!content) return "";
      if (typeof content === "string") return content;
      return content.map((item) => item.text ?? "").join("");
    }, [content]);

    const toolStatusMessage = getToolStatusMessage(message, isLoading);
    const hasToolError = message.actionType === "tool_call" && message.error;

    return (
      <div
        ref={ref}
        className={cn(messageVariants({ variant, align: role }), className)}
        {...props}
      >
        <div className="flex flex-col">
          <div className={cn(bubbleVariants({ role }))}>
            <div className="break-words whitespace-pre-wrap">
              <div className="text-sm mb-1 opacity-50">
                {/* {role === "user" ? "You" : "Tambo AI"} */}
              </div>
              {!content ? (
                <span className="text-muted-foreground italic">
                  Empty message
                </span>
              ) : typeof content === "string" ? (
                <ReactMarkdown components={createMarkdownComponents()}>
                  {safeContent}
                </ReactMarkdown>
              ) : (
                content.map((item, index) => (
                  <span key={index}>
                    {item.text ? (
                      <ReactMarkdown components={createMarkdownComponents()}>
                        {item.text}
                      </ReactMarkdown>
                    ) : (
                      ""
                    )}
                  </span>
                ))
              )}
              {toolStatusMessage && (
                <div className="flex items-center gap-2 text-xs opacity-50 mt-2">
                  {hasToolError ? (
                    <X className="w-3 h-3 text-bold text-red-500" />
                  ) : isLoading ? (
                    <Loader2 className="w-3 h-3 text-muted-foreground text-bold animate-spin" />
                  ) : (
                    <Check className="w-3 h-3 text-bold text-green-500" />
                  )}
                  <span>{toolStatusMessage}</span>
                </div>
              )}
              {isLoading && role === "assistant" && !content && (
                <div className="flex items-center gap-1 h-4 p-1 mt-1">
                  <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                  <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
Message.displayName = "Message";

export { Message, messageVariants };
