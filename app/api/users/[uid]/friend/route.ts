import { NewFriendApplication } from "@/emails/NewFriendApplication/NewFriendApplication";
import { db } from "@/lib/firebase";
import { User } from "@/models/User";
import { collection, doc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { userId } = await req.json();
    const base = process.env.NEXT_PUBLIC_URL

    if (!uid || !userId || !base) {
        return NextResponse.json({ message: "User id is required" }, { status: 403 });
    }

    const q = query(collection(db, "friends"), where("senderId", "==", userId), where("receiverId", "==", uid));
    const d = await getDocs(q);
    if (d.docs.length > 0) {
        const data = d.docs[0].data()
        if (data['status'] && data['status'] === 'WAITING') {
            await updateDoc(d.docs[0].ref, {
                'status': 'APPROVED'
            })
            return NextResponse.json({ message: "You are friends now" }, { status: 202 })
        }
    }

    const q1 = query(collection(db, "friends"), where("senderId", "==", uid), where("receiverId", "==", userId));
    const d1 = await getDocs(q1);
    if (d1.docs.length > 0) {
        return NextResponse.json({ message: "Application already sent" }, { status: 409 })
    }

    const ref = doc(collection(db, "friends"))
    const newFriend = {
        id: ref.id,
        senderId: uid,
        receiverId: userId,
        status: "WAITING",
        date: Timestamp.fromDate(new Date())
    }
    await setDoc(ref, newFriend);

    const response = await fetch(`${base}/api/users/${uid}`, {
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
        },
    });
    const response2 = await fetch(`${base}/api/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
        },
    });
    const u = await response.json() as User
    const u2 = await response2.json() as User

    if (u && u2.email) {
        const emailComponent = NewFriendApplication({
            senderName: u.name,
            senderId: uid,
            userId,
            senderNickname: u.nickname
        });

        // Dynamic import to avoid Next.js build issues
        const { renderToStaticMarkup } = await import("react-dom/server");
        const html = renderToStaticMarkup(emailComponent);

        const resp = await fetch(`${base}/api/email`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({
                to: [u2.email],
                subject: "Новая заявка в друзья",
                html
            })
        })
        const data = await resp.json();
        console.log(data)
    }

    return NextResponse.json({ id: ref.id }, { status: 200 })
}