import { db } from "@/lib/firebase";
import { MeetsType } from "@/models/Meet";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export type MeetsDTO = {
    members: string[],
    date: Date,
    status: MeetsType,
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    if (!data) {
        return NextResponse.json({ message: "Meet is required" }, { status: 403 });
    }

    const meet = data as MeetsDTO;
    const newDoc = doc(collection(db, "meets"));

    const newMeet = {
        id: newDoc.id,
        members: meet.members,
        date: Timestamp.fromDate(meet.date),
        status: meet.status,
        createdAt: Timestamp.now()
    }

    await setDoc(newDoc, newMeet);
    return NextResponse.json({ id: newMeet.id }, { status: 200 })
}