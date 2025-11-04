"use client";
import { useRouter } from "next/navigation";

export default function YandexLogin() {
    const router = useRouter();
    const clientId = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID!;

    const handleYandexLogin = () => {
        const u = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}`
        router.push(u);
    };

    return (
        <button onClick={handleYandexLogin}>Yandex</button>        
    );
}