"use client";
import { components } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={components}
          tamboUrl={"http://localhost:3001"}
        >
          <TamboMcpProvider
            mcpServers={[
              `http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}/sse`,
            ]}
          >
            {children}
          </TamboMcpProvider>
        </TamboProvider>
      </body>
    </html>
  );
}
