import { db } from "@/lib/firebase";
import { Application, ApplicationMemberStatus, ApplicationStatus } from "@/models/Application";
import { randomUUID } from "crypto";
import { collection, doc, getDocs, query, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

//CREATE NEW MEET 
export async function POST(req: NextRequest) {
    const data = await req.json();

    if (!data) {
        return NextResponse.json({ message: "Application is required" }, { status: 403 });
    }

    const documents = await getDocs(collection(db, "applications"));
    const count = documents.docs.length;
    const application = data as Application;
    const newDoc = doc(collection(db, "applications"));

    const newApplication = {
        id: newDoc.id,
        ownerId: application.ownerId,
        members: [{ id: randomUUID(), userId: application.ownerId, status: ApplicationMemberStatus.approved }],
        status: ApplicationStatus.open,
        location: application.location,
        membersCount: application.membersCount === 0 ? null : application.membersCount,
        noAlcohol: application.noAlcohol,
        ageRange: application.ageRange === "none" ? null : application.ageRange,
        title: application.title === "" ? `Поиск встречи #${count}` : application.title,
        description: application.description === "" ? null : application.description,
        meetType: application.meetType === "none" ? null : application.meetType,
        date: Timestamp.fromDate(new Date(application.date)),
        duration: application.duration === "" ? null : application.duration,
        createdAt: Timestamp.fromDate(new Date())
    }

    await setDoc(newDoc, newApplication);
    return NextResponse.json({ id: newApplication.id }, { status: 200 })
}