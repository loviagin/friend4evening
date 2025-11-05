import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    if (!uid) {
        return NextResponse.json({ message: "Uid is required" }, { status: 400 });
    }

    const u = await getDoc(doc(db, "users", uid));

    if (!u.exists) {
        return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    return NextResponse.json(u);
}