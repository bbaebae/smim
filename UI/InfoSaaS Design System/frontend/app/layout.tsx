import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: '스밈 — Second Brain',
  description: '지식이 스며드는 곳. 읽고, 요약하고, 반복 복습하는 세컨드 브레인',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
