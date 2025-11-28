import { db } from "@/lib/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { adminId, userId } = await req.json();

    if (!adminId || !userId) {
        return NextResponse.json({ message: "Admin id & user id is required" }, { status: 403 })
    }

    const q = query(collection(db, "users"), where("tags", "array-contains", "admin"), where("id", "==", adminId));
    const d = await getDocs(q);

    if (d.docs.length === 1) {
        await updateDoc(doc(db, "users", userId), {
            "blocked": true
        })
        return NextResponse.json({ userId: userId }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}