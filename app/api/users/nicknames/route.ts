import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// return all nicknames
export async function GET() {
    const documents = await getDocs(collection(db, "users"));

    if (!documents) {
        return NextResponse.json({ message: "Documents not found" }, { status: 400 });
    }

    const nicknames = documents.docs.flatMap((user) => { return user.data()["nickname"] });

    if (!nicknames) {
        return NextResponse.json({ message: "No nicknames found" }, { status: 400 });
    }

    return NextResponse.json({ nicknames: nicknames }, { status: 200 });
}