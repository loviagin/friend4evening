import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { privacy } = await req.json();

    if (!uid) {
        return NextResponse.json({ message: "User id is required" }, { status: 403 });
    }

    if (!privacy || !Array.isArray(privacy)) {
        return NextResponse.json({ message: "Privacy array is required" }, { status: 400 });
    }

    await updateDoc(doc(db, "users", uid), {
        "privacy": privacy
    })

    return NextResponse.json({ privacy }, { status: 200 })
}
