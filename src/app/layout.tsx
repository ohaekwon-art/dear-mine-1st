import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "권오애 | 자연과 쉼이 머무는 공간",
  description: "권오애의 개인 홈페이지입니다. 일상과 자연, 그리고 새로운 배움의 이야기들을 담았습니다.",
  icons: {
    icon: "/pabicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F7F9F6] text-[#223420] antialiased">
        {children}
      </body>
    </html>
  );
}
