import { db } from "@/lib/firebase";
import { Meet } from "@/models/Meet";
import { deleteDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    if (!uid) {
        return NextResponse.json({ message: "Uid is required" }, { status: 400 });
    }

    let m = await getDoc(doc(db, "meets", uid));
    const data = m.data();
    if (!data) {
        return NextResponse.json({ message: "Meet not found" }, { status: 400 });
    }

    data["date"] = (data["date"] as Timestamp).toDate()
    data["createdAt"] = (data["createdAt"] as Timestamp).toDate()

    if (!(data as Meet)) {
        return NextResponse.json({ message: "Meet not found" }, { status: 400 });
    }

    return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    if (!uid) {
        return NextResponse.json({ message: "Uid is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, "meets", uid));

    return NextResponse.json({ message: "ok" }, { status: 200 });
}