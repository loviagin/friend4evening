import { db } from "@/lib/firebase";
import { Meet } from "@/models/Meet";
import { deleteDoc, doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { title, description } = await req.json();;

    if (!uid) {
        return NextResponse.json({ message: "Uid is required" }, { status: 400 });
    }

    try {
        const updateData: Record<string, any> = {};
        
        if (title !== undefined) {
            updateData["title"] = title;
        }
        
        if (description !== undefined) {
            updateData["description"] = description === "" ? null : description;
        }

        await updateDoc(doc(db, "meets", uid), updateData);

        return NextResponse.json({ message: "Meet updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating meet:", error);
        return NextResponse.json({ message: "Error updating meet" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    if (!uid) {
        return NextResponse.json({ message: "Uid is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, "meets", uid));

    return NextResponse.json({ message: "ok" }, { status: 200 });
}
