import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function sitemap() {
    const urls: { url: string; lastModified?: string }[] = [];

    // 1. Статические страницы (автоматически)
    const staticRoutes = [
        "",
        "/account/meets",
        "/account/messages",
        "/account/profile",
        "/account/notifications",
        "/agreement",
        "/login",
        "/privacy",
        "/rules",
        "/contacts",
        "/apps"
    ];
    staticRoutes.forEach((route) => {
        urls.push({
            url: `https://f4e.io${route}`,
            lastModified: new Date().toISOString(),
        });
    });

    // 2. Динамические пользователи (автоматически)
    const snap = await getDocs(collection(db, "users"));
    const nicknames = snap.docs
        .map(d => d.data().nickname)
        .filter((n): n is string => typeof n === "string" && n.length > 0);
    nicknames.forEach((nickname) => {
        urls.push({
            url: `https://f4e.io/profile/${nickname}`,
            lastModified: new Date().toISOString(),
        });
    });

    return urls;
}