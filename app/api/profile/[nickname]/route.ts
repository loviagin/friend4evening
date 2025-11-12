import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ nickname: string }> }) {
    const { nickname } = await params;

    if (!nickname) {
        return NextResponse.json({ message: "Nickname is required" }, { status: 500 });
    }

    const q = query(collection(db, "users"), where("nickname", "==", nickname));
    const docs = await getDocs(q);

    let user = docs.docs[0].data();
    const date = user["birthday"] as Timestamp;
    user["birthday"] = date.toDate();
    const r = user["dateRegistered"] as Timestamp
    user["dateRegistered"] = r.toDate();

    if (docs.docs.length === 1) {
        return NextResponse.json({ user }, { status: 200 });
    } else {
        return NextResponse.json({ message: "Many items found" }, { status: 400 });
    }
}