import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import AgeGate from "./components/AgeGate/AgeGate";
import Footer from "@/components/Footer/Footer";

const nunitoFont = Nunito({
  variable: "--font-nunito",
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Friend4Evening – найти друга на вечер",
  description: "Удобный поиск и фильтр по нужным параметрам, чаты и много другое на friend4evening. 18+",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${nunitoFont.variable}`}>
        <Header />
        <AgeGate />
        {children}
        <Footer />
      </body>
    </html>
  );
}
