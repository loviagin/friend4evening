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
      <body className={`${nunitoFont.variable}`}>
        <AuthProvider>
          <Header />
          <AgeGate />
          {children}
          <MobileMenuBar />
          <Footer />
        </AuthProvider>

        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
        >{`
          (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){
                  (m[i].a=m[i].a||[]).push(arguments)
              };
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),
              a=e.getElementsByTagName(t)[0],
              k.async=1,
              k.src=r,
              a.parentNode.insertBefore(k,a)
          })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

          ym(105573360, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              ecommerce: "dataLayer",
              accurateTrackBounce: true,
              trackLinks: true
          });
        `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/105573360"
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
