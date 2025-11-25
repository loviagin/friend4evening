import { db } from "@/lib/firebase";
import { Meet } from "@/models/Meet";
import { collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    const q = query(collection(db, "meets"), where("ownerId", "==", userId), where("status", "==", "plan"))
    const d = await getDocs(q)

    if (d.docs.length > 0) {
        for (const d1 of d.docs) {
            const data = d1.data()

            data["date"] = (data["date"] as Timestamp).toDate();
            data["createdAt"] = (data["createdAt"] as Timestamp).toDate();
            const meet = data as Meet

            if (meet.date < new Date()) {
                await updateDoc(doc(db, "meets", meet.id), {
                    "status": "canceled"
                })
            }
        }
    }

    return NextResponse.json({ message: "Ok" }, { status: 200 })
}