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