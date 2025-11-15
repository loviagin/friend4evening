import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id, email } = await req.json();

    console.log("email", email);
    if (!email || !id) {
        return NextResponse.json({ message: "Email & id is required" }, { status: 400 })
    }

    const document = await getDoc(doc(db, "users", id));

    if (document.exists()) { //user in database
        return NextResponse.json({ userId: document.data()["id"] }, { status: 202 })
    } else { //user not in database
        return NextResponse.json({ message: "No user" }, { status: 404 });
    }
}