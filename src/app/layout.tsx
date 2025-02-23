import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from '@/components/nav-bar';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "区块链浏览器",
  description: "一个简单的区块链浏览器和交互工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}>
        <NavBar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
