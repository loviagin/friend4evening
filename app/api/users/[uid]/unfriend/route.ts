import { db } from "@/lib/firebase";
import { arrayRemove, collection, deleteDoc, doc, getDocs, or, query, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { userId } = await req.json();
    const base = process.env.NEXT_PUBLIC_URL

    if (!uid || !userId || !base) {
        return NextResponse.json({ message: "User id is required" }, { status: 403 });
    }

    const q = query(collection(db, "friends"), or(
        where("senderId", "==", userId), where("receiverId", "==", uid),
        where("senderId", "==", uid), where("receiverId", "==", userId))
    )
    const d = await getDocs(q);
    if (d.docs.length > 0) {
        await deleteDoc(d.docs[0].ref)

        await updateDoc(doc(db, "users", uid), {
            'friends': arrayRemove(userId)
        })
        await updateDoc(doc(db, "users", userId), {
            'friends': arrayRemove(uid)
        })

        return NextResponse.json({ message: "Success" }, { status: 200 })
    }

    return NextResponse.json({ message: "Error" }, { status: 404 })
}