import { db } from "@/lib/firebase";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    if (!uid) {
        return NextResponse.json({ message: "Uid is required" }, { status: 400 });
    }

    let u = await getDoc(doc(db, "users", uid));
    const data = u.data();
    if (!data) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const b = data["birthday"] as Timestamp
    data["birthday"] = b.toDate();
    console.log(data["birthday"]);
    const r = data["dateRegistered"] as Timestamp
    data["dateRegistered"] = r.toDate();

    if (!u.exists) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    return NextResponse.json(data);
}