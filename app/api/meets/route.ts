import { db } from "@/lib/firebase";
import { ApplicationMemberStatus, Meet, MeetStatus } from "@/models/Meet";
import { randomUUID } from "crypto";
import { collection, doc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export type MeetsDTO = {
    members: string[],
    date: Date,
    status: MeetStatus,
}

//CREATE NEW MEET 
export async function POST(req: NextRequest) {
    const data = await req.json();

    if (!data) {
        return NextResponse.json({ message: "Meet is required" }, { status: 403 });
    }

    const documents = await getDocs(collection(db, "meets"));
    const count = documents.docs.length;
    const application = data as Meet;
    const newDoc = doc(collection(db, "meets"));

    const newApplication = {
        id: newDoc.id,
        ownerId: application.ownerId,
        members: [{ id: randomUUID(), userId: application.ownerId, status: ApplicationMemberStatus.approved }],
        status: MeetStatus.plan,
        location: application.location,
        membersCount: application.membersCount === 0 ? null : application.membersCount,
        noAlcohol: application.noAlcohol,
        ageRange: application.ageRange === "none" ? null : application.ageRange,
        title: application.title === "" ? `Встреча #${count}` : application.title,
        description: application.description === "" ? null : application.description,
        meetType: application.meetType === "none" ? null : application.meetType,
        date: Timestamp.fromDate(new Date(application.date)),
        duration: application.duration === "" ? null : application.duration,
        createdAt: Timestamp.fromDate(new Date())
    }

    await setDoc(newDoc, newApplication);
    return NextResponse.json({ id: newApplication.id }, { status: 200 })
}