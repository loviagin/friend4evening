import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import MobileMenuBar from "@/components/MobileMenuBar/MobileMenuBar";
import { AuthProvider } from '../_providers/AuthProvider';
import AgeGate from '../components/AgeGate/AgeGate';

const nunitoFont = Nunito({
    variable: "--font-nunito",
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: "Friends4Evening – найти друга на вечер",
    description: "Удобный поиск и фильтр по нужным параметрам, чаты и многое другое на Friends4Evening. 18+",
};

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: ReactNode;
    params: { locale: string };
}) {
    let messages;
    try {
        messages = (await import(`../../messages/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html lang={locale}>
            <body className={`${nunitoFont.variable}`}>
                <AuthProvider>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <Header />
                        <AgeGate />
                        {children}
                        <MobileMenuBar />
                        <Footer />
                    </NextIntlClientProvider>
                </AuthProvider>
            </body>
        </html>
    );
}