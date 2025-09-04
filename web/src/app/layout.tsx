import AuthHeader from "@/components/AuthHeader";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GPT Archiv",
  description: "Self-hosted ChatGPT Archiver",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-dvh antialiased">
        <AuthHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
