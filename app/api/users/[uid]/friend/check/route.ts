import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { userId } = await req.json();
    const base = process.env.NEXT_PUBLIC_URL

    if (!uid || !userId || !base) {
        return NextResponse.json({ message: "User id is required" }, { status: 403 });
    }

    const q = query(collection(db, "friends"), where("senderId", "==", uid), where("receiverId", "==", userId));
    const d = await getDocs(q);
    if (d.docs.length > 0) {
        const data = d.docs[0].data();
        if (data['status'] && data['status'] === 'WAITING') {
            return NextResponse.json({ message: "Waiting" }, { status: 409 })
        } else {
            return NextResponse.json({ message: "Friends" }, { status: 200 })
        }
    }

    return NextResponse.json({ message: "Not friend" }, { status: 404 })
}