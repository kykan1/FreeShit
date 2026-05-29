import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Free Stuff Dashboard",
  description: "Free tools, food, software, swag, events, and research resources for UCLA students."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
