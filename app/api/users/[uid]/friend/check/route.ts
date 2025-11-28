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
        console.log(data)
        if (data['status']) {
            if (data['status'] === 'WAITING') {
                console.log("WAITING")
                return NextResponse.json({ message: "Waiting" }, { status: 409 })
            } else if (data['status'] === 'APPROVED') {
                console.log("APPROVED")
                return NextResponse.json({ message: "Friends" }, { status: 200 })
            } else if (data['status'] === 'DECLINED') {
                console.log("DECLINED")
                return NextResponse.json({ message: "Not friend" }, { status: 404 })
            }
        }
    }

    return NextResponse.json({ message: "Not friend" }, { status: 404 })
}