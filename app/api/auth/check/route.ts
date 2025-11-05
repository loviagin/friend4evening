import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDocs, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, name, avatarUrl, provider, passwordHash, birthday } = await req.json();

    console.log("email", email);
    if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const q = query(collection(db, "users"), where("email", "==", email))
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) { //user registered
        return NextResponse.json({ userId: querySnapshot.docs[0].data()["id"] }, { status: 202 })
    } else { //new user
        const newUser = {
            name: name ?? "",
            email,
            passwordHash,
            provider: provider ?? "not_provided",
            avatarUrl: avatarUrl ?? "avatar1",
            birthday: birthday ?? Timestamp.fromDate(new Date()),
            dateRegistered: Timestamp.fromDate(new Date()),
        };

        const ref = await addDoc(collection(db, "users"), newUser);
        return NextResponse.json({ userId: ref.id }, { status: 201 });
    }
}