import { db } from "@/lib/firebase";
import { randomUUID } from "crypto";
import { collection, doc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, name, avatarUrl, provider, passwordHash, birthday } = await req.json();

    console.log("email", email);
    if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const q = query(collection(db, "users"), where("email", "==", email))
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) { //user in database
        return NextResponse.json({ userId: querySnapshot.docs[0].data()["id"] }, { status: 202 })
    } else { //user not in database
        const newUser = {
            id: randomUUID().toString(),
            name: name ?? "",
            email,
            passwordHash,
            provider: provider ?? "not_provided",
            avatarUrl: avatarUrl ?? "avatar1",
            birthday,
            dateRegistered: Timestamp.fromDate(new Date()),
        };

        await setDoc(doc(db, "users", newUser.id), newUser);
        return NextResponse.json({ userId: newUser.id }, { status: 201 });
    }
}