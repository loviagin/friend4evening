import { db } from "@/lib/firebase";
import { User } from "@/models/User";
import { collection, getDocs, query, Timestamp, where, limit } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const searchParams = req.nextUrl.searchParams;
    const searchQuery = searchParams.get('q') || '';
    const currentUserId = uid || '';

    try {
        // Базовый запрос: исключаем заблокированных и тех, у кого запрет на приглашения
        let q = query(
            collection(db, "users"),
            where("blocked", "==", false)
        );

        const documents = await getDocs(q);

        if (!documents) {
            return NextResponse.json({ message: "Documents not found" }, { status: 400 });
        }

        let users: User[] = [];
        
        for (const u of documents.docs) {
            const user = u.data();
            
            // Исключаем пользователей с запретом на приглашения (meetInvitesFriendsOnly)
            const privacy = user.privacy || [];
            if (privacy.includes("meetInvitesFriendsOnly")) {
                // Если текущий пользователь не передан или не является другом, пропускаем
                if (!currentUserId || !user.friends?.includes(currentUserId)) {
                    continue;
                }
            }

            user["birthday"] = (user["birthday"] as Timestamp).toDate();
            user["dateRegistered"] = (user["dateRegistered"] as Timestamp).toDate();

            users.push(user as User);
        }

        // Если есть поисковый запрос, фильтруем по имени и никнейму
        if (searchQuery.trim()) {
            const queryLower = searchQuery.toLowerCase().trim();
            users = users.filter(user => 
                user.name.toLowerCase().includes(queryLower) ||
                user.nickname?.toLowerCase().includes(queryLower)
            );
        }

        // Сортируем пользователей
        users.sort((a, b) => {
            // 1. Сортировка по наличию city
            const hasCityA = Boolean(a.location?.city);
            const hasCityB = Boolean(b.location?.city);

            if (hasCityA && !hasCityB) return -1;
            if (!hasCityA && hasCityB) return 1;

            // 2. Сортировка по bio: сначала непустые
            const hasBioA = Boolean(a.bio && a.bio.trim().length > 0);
            const hasBioB = Boolean(b.bio && b.bio.trim().length > 0);

            if (hasBioA && !hasBioB) return -1;
            if (!hasBioA && hasBioB) return 1;

            // 3. Альфавитная сортировка по bio (если обе есть)
            if (hasBioA && hasBioB) {
                return a.bio!.localeCompare(b.bio!);
            }

            return 0;
        });

        // Если запрос пустой, возвращаем первых 10
        if (!searchQuery.trim()) {
            users = users.slice(0, 10);
        }

        return NextResponse.json({ users: users }, { status: 200 });
    } catch (error) {
        console.error("Error searching users:", error);
        return NextResponse.json({ message: "Error searching users" }, { status: 500 });
    }
}
