import { db } from "@/lib/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string, userId: string }> }) {
    const { uid, userId } = await params;

    if (!uid || !userId) {
        return NextResponse.json({ message: "User id & uid is required" }, { status: 403 });
    }

    const q = query(collection(db, "friends"), where("senderId", "==", userId))
    const d = await getDocs(q);

    if (d.docs.length === 1) {
        const ref = doc(db, "friends", d.docs[0].get("id"))
        await updateDoc(ref, {
            "status": "DECLINED"
        });

        return NextResponse.redirect("https://f4e.io/account/profile", 307);
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}