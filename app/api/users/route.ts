import { db } from "@/lib/firebase";
import { User } from "@/models/User";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { adminId } = await req.json();

    if (!adminId) {
        return NextResponse.json({ message: "Admin id is required" }, { status: 403 })
    }

    const q = query(collection(db, "users"), where("tags", "array-contains", "admin"), where("id", "==", adminId));
    const d = await getDocs(q);

    if (d.docs.length === 1) {
        const u = await getDocs(collection(db, "users"))
        const resp = u.docs.map((us) => {
            const n = us.data() as User
            n.birthday = (us.data()["birthday"] as Timestamp).toDate()
            n.dateRegistered = (us.data()["dateRegistered"] as Timestamp).toDate()
            return n
        })
        return NextResponse.json({ users: resp }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}

export async function GET() {
    const q = query(collection(db, "users"), where("blocked", "==", false))
    const documents = await getDocs(q);

    if (!documents) {
        return NextResponse.json({ message: "Documents not found" }, { status: 400 });
    }

    const users = documents.docs.flatMap((u) => {
        const user = u.data()

        const b = user["birthday"] as Timestamp
        user["birthday"] = b.toDate();
        console.log(user["birthday"]);
        const r = user["dateRegistered"] as Timestamp
        user["dateRegistered"] = r.toDate();

        return user;
    })
        .sort((a, b) => {
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

    return NextResponse.json({ users: users }, { status: 200 });
}