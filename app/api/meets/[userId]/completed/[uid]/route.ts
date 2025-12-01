import { db } from "@/lib/firebase";
import { Meet } from "@/models/Meet";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string; uid: string }> }
) {
    const { userId, uid } = await params;

    if (!userId || !uid) {
        return NextResponse.json(
            { message: "User Id & current user Id is required" },
            { status: 403 }
        );
    }

    console.log("check completed meet for pair:", userId, uid);

    // 🔹 1. Один array-contains — только по одному участнику
    const q = query(
        collection(db, "meets"),
        where("memberIds", "array-contains", userId),
        where("status", "==", "completed"),
        where("blocked", "==", false)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        return NextResponse.json({ completed: false }, { status: 200 });
    }

    let result = false;

    for (const docSnap of snap.docs) {
        const meet = docSnap.data() as Meet;

        // 🔹 2. Проверяем, что второй участник тоже есть в memberIds
        if (!meet.memberIds || !meet.memberIds.includes(uid)) {
            continue;
        }

        // 🔹 3. Проверяем, что ОТДЕЛЬНО оба участника присутствуют среди members с status === 'approved'
        const hasFirstApproved = meet.members.some(
            (m) => m.userId === userId && m.status === "approved"
        );
        const hasSecondApproved = meet.members.some(
            (m) => m.userId === uid && m.status === "approved"
        );

        if (hasFirstApproved && hasSecondApproved) {
            result = true;
            break;
        }
    }

    return NextResponse.json({ completed: result }, { status: 200 });
}