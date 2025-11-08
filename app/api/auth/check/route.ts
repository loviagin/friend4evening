import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id, email, name, avatarUrl, provider, passwordHash, birthday } = await req.json();

    console.log("email", email);
    if (!email || !id) {
        return NextResponse.json({ message: "Email & id is required" }, { status: 400 })
    }

    // const q = query(collection(db, "users"), where("email", "==", email))
    // const querySnapshot = await getDocs(q);
    const document = await getDoc(doc(db, "users", id));

    if (document.exists()) { //user in database
        return NextResponse.json({ userId: document.data()["id"] }, { status: 202 })
    } else { //user not in database
        const status: Record<string, Date> = { "online": new Date() }

        const newUser = {
            id,
            name: name ?? "",
            email,
            passwordHash,
            provider: provider ?? "not_provided",
            status,
            avatarUrl: avatarUrl ?? "avatar1",
            birthday,
            dateRegistered: Timestamp.fromDate(new Date()),
        };

        await setDoc(doc(db, "users", newUser.id), newUser);
        return NextResponse.json({ userId: newUser.id }, { status: 201 });
    }
}