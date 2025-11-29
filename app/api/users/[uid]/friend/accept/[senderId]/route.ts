import { db } from "@/lib/firebase";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string, senderId: string }> }) {
    const { uid, senderId } = await params;

    if (!uid || !senderId) {
        return NextResponse.json({ message: "User id & uid is required" }, { status: 403 });
    }

    const ref = doc(db, "users", uid)
    await updateDoc(ref, {
        "friends": arrayUnion(senderId)
    });
    const ref2 = doc(db, "users", senderId)
    await updateDoc(ref2, {
        "friends": arrayUnion(uid)
    });

    const q = query(collection(db, "friends"), where("senderId", "==", senderId), where("status", "==", "WAITING"))
    const q2 = query(collection(db, "users", uid, "notifications"), where("type", "==", "friend-request"), where("senderId", "==", senderId))

    const d = await getDocs(q);
    const d2 = await getDocs(q2);

    if (d.docs.length === 1) {
        const docRef = doc(db, "friends", d.docs[0].get("id"))
        await updateDoc(docRef, {
            "status": "APPROVED"
        });

        d2.docs.forEach(async (r) => {
            console.log("UPDATED NOTIFICATION")
            await updateDoc(r.ref, {
                "type": "friend-request-processed"
            });
        })
        
        return NextResponse.redirect("https://f4e.io/account/profile?tab=friends", 307);
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string, senderId: string }> }) {
    const { uid, senderId } = await params;

    if (!uid || !senderId) {
        return NextResponse.json({ message: "User id & uid is required" }, { status: 403 });
    }

    const ref = doc(db, "users", uid)
    await updateDoc(ref, {
        "friends": arrayUnion(senderId)
    });
    const ref2 = doc(db, "users", senderId)
    await updateDoc(ref2, {
        "friends": arrayUnion(uid)
    });

    const q = query(collection(db, "friends"), where("senderId", "==", senderId), where("status", "==", "WAITING"))
    const q2 = query(collection(db, "users", uid, "notifications"), where("type", "==", "friend-request"), where("senderId", "==", senderId))

    const d = await getDocs(q);
    const d2 = await getDocs(q2);

    if (d.docs.length === 1) {
        const docRef = doc(db, "friends", d.docs[0].get("id"))
        await updateDoc(docRef, {
            "status": "APPROVED"
        });

        d2.docs.forEach(async (r) => {
            console.log("UPDATED NOTIFICATION")
            await updateDoc(r.ref, {
                "type": "friend-request-processed"
            });
        })

        return NextResponse.json({ message: "Ok" }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}