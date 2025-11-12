import { db } from "@/lib/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }>}) {
    const { uid } = await params;
    const { userId } = await req.json();

    if (!uid || !userId) {
        return NextResponse.json({ message: "User id is required" }, { status: 403 });
    }

    await updateDoc(doc(db, "users", uid), {
        "blockedUsers": arrayUnion(userId)
    })

    return NextResponse.json({ blocked: true }, { status: 200 })
}