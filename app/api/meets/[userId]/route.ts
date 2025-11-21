import { db } from "@/lib/firebase";
import { Meets } from "@/models/Meet";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

//GETTING ALL MEETS BY USER ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    const q = query(collection(db, "meets"), where("members", "array-contains", userId))
    const documents = await getDocs(q);

    if (documents.docs.length > 0) {
        const meets = documents.docs.flatMap((d) => {
            const meet = d.data() as Meets
            const time = d.data()['date'] as Timestamp
            const created = d.data()['createdAt'] as Timestamp
            meet.date = time.toDate()
            meet.createdAt = created.toDate();
            return meet;
        })

        return NextResponse.json({ meets }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}