import { db } from "@/lib/firebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string, senderId: string }> }) {
    const { uid, senderId } = await params;

    if (!uid || !senderId) {
        return NextResponse.json({ message: "User id & uid is required" }, { status: 403 });
    }

    const q = query(collection(db, "friends"), where("senderId", "==", senderId), where("status", "==", "WAITING"))
    const q2 = query(collection(db, "users", uid, "notifications"), where("type", "==", "friend-request"), where("senderId", "==", senderId))

    const d = await getDocs(q);
    const d2 = await getDocs(q2);

    if (d.docs.length === 1) {
        const ref = doc(db, "friends", d.docs[0].get("id"))
        await updateDoc(ref, {
            "status": "DECLINED"
        });

        if (d2.docs.length === 1) {
            await updateDoc(d2.docs[0].ref, {
                "type": "friend-request-processed"
            });
        }

        return NextResponse.redirect("https://f4e.io/account/profile", 307);
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string, senderId: string }> }) {
    const { uid, senderId } = await params;

    if (!uid || !senderId) {
        return NextResponse.json({ message: "User id & uid is required" }, { status: 403 });
    }

    const q = query(collection(db, "friends"), where("senderId", "==", senderId), where("status", "==", "WAITING"))
    const q2 = query(collection(db, "users", uid, "notifications"), where("type", "==", "friend-request"), where("senderId", "==", senderId))

    const d = await getDocs(q);
    const d2 = await getDocs(q2);

    if (d.docs.length === 1) {
        const ref = doc(db, "friends", d.docs[0].get("id"))
        await updateDoc(ref, {
            "status": "DECLINED"
        });

        if (d2.docs.length === 1) {
            await updateDoc(d2.docs[0].ref, {
                "type": "notification"
            });
        }

        return NextResponse.json({ message: "Ok" }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}