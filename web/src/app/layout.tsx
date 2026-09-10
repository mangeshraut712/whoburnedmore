import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "whoburnedmore — AI Token Leaderboard",
  description:
    "See who’s burning the most AI coding tokens. Run one command to join the leaderboard.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("dark", GeistSans.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body
        className={cn(
          GeistSans.className,
          "min-h-screen bg-background text-foreground antialiased",
        )}
      >
        {children}
      </body>
    </html>
  );
}
