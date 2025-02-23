import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

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
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link 
                    href="/" 
                    className="text-xl font-bold text-gray-900 hover:text-gray-700"
                  >
                    区块链浏览器
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
                  >
                    区块信息
                  </Link>
                  <Link
                    href="/event-listening"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
                  >
                    事件监听
                  </Link>
                  <Link
                    href="/send-transaction"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
                  >
                    发送交易
                  </Link>
                  <Link
                    href="/read-contract"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
                  >
                    合约读取
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
