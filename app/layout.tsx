import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import AgeGate from "./components/AgeGate/AgeGate";
import Footer from "@/components/Footer/Footer";
import { AuthProvider } from "./_providers/AuthProvider";
import MobileMenuBar from "@/components/MobileMenuBar/MobileMenuBar";
import Script from "next/script";

const nunitoFont = Nunito({
  variable: "--font-nunito",
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Friends4Evening – найти друга на вечер",
  description: "Удобный поиск и фильтр по нужным параметрам, чаты и многое другое на Friends4Evening. 18+",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <Script>
          {`
            (function(w,d,s,l,i){w[l] = w[l] || [];w[l].push(
              {'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })
              (window,document,'script','dataLayer','GTM-PGRKHD3P');
          `}
        </Script>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
            k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(105573360, "init", {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
      </head>
      <body className={`${nunitoFont.variable}`}>
        <AuthProvider>
          <Header />
          <AgeGate />
          {children}
          <MobileMenuBar />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
