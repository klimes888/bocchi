import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "bocchi the rock!",
  description: "bocchi the rock",
  generator: "soft landing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
