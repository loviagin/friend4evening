import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ nickname: string }> }) {
    const { nickname } = await params;

    if (!nickname) {
        return NextResponse.json({ message: "Nickname is required" }, { status: 500 });
    }

    const q = query(collection(db, "users"), where("nickname", "==", nickname));
    const docs = await getDocs(q);

    if (docs.docs.length === 1) {
        return NextResponse.json({ user: docs.docs[0].data() }, { status: 200 });
    } else {
        return NextResponse.json({ message: "Many items found" }, { status: 400 });
    }
}