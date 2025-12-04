import { db } from "@/lib/firebase";
import { Notification } from "@/models/Notification";
import { collection, doc, getDocs, setDoc, Timestamp, writeBatch } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

//GETTING ALL NOTIFICATIONS BY userId AND UPDATE readAt
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    const documents = await getDocs(collection(db, "users", userId, "notifications"));

    if (documents.docs.length > 0) {
        const notifications = documents.docs.flatMap((n) => {
            const data = n.data()

            data['createdAt'] = (data['createdAt'] as Timestamp).toDate()

            if (data["readAt"] && data["readAt"] !== null) {
                data['readAt'] = (data['readAt'] as Timestamp).toDate()
            }

            return data as Notification;
        }).sort((a, b) => {
            const isAUnread = a.readAt === null;
            const isBUnread = b.readAt === null;

            if (isAUnread !== isBUnread) {
                return isAUnread ? -1 : 1;
            }

            return b.createdAt.getTime() - a.createdAt.getTime();
        });

        void markNotificationsDelivered(userId, notifications).catch((err) => {
            console.error("Failed to update notifications in background", err);
        });

        return NextResponse.json(notifications, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}

async function markNotificationsDelivered(userId: string, notifications: Notification[]) {
    const batch = writeBatch(db);

    for (const n of notifications) {
        const ref = doc(db, "users", userId, "notifications", n.id);
        batch.update(ref, { readAt: Timestamp.now() });
    }

    await batch.commit();
}

export type NotificationDTO = {
    type: string,
    title: string,
    description: string,
    senderId: string,
    url: string | null,
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const data = await req.json();
    const { userId } = await params;
    const base = process.env.NEXT_PUBLIC_URL!

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    if (!data) {
        return NextResponse.json({ message: "Meet is required" }, { status: 403 });
    }

    const notification = data as NotificationDTO;
    const newDoc = doc(collection(db, "users", userId, "notifications"));

    const newNotification = {
        id: newDoc.id,
        createdAt: Timestamp.fromDate(new Date()),
        readAt: null,
        title: notification.title,
        description: notification.description,
        type: notification.type,
        senderId: notification.senderId,
        url: notification.url ?? `${base}`
    }

    if (notification.type === "friends" || notification.type === "friend-request") {
        const r = await fetch(`${base}/api/users/${notification.senderId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
        })
        const d = await r.json();
        newNotification.url = d['nickname']
    }

    await setDoc(newDoc, newNotification);
    return NextResponse.json({ id: newNotification.id }, { status: 200 })
}