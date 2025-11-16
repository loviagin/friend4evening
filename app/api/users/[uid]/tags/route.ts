import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }>}) {
    const { uid } = await params;
    const { tag } = await req.json();

    if (!uid || !tag) {
        return NextResponse.json({ message: "User id is required" }, { status: 403 });
    }

    await updateDoc(doc(db, "users", uid), {
        "tag": tag
    })

    return NextResponse.json({ tag }, { status: 200 })
}