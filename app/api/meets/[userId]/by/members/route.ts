import { db } from "@/lib/firebase";
import { Meet } from "@/models/Meet";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

//GETTING SELF MEETS BY USER ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    const q = query(collection(db, "meets"), where("memberIds", "array-contains", userId), where("blocked", "==", false));
    const documents = await getDocs(q);

    if (documents.docs.length > 0) {
        let meets: Meet[] = []
        for (const ap of documents.docs) {
            const data = ap.data()

            data['date'] = (data['date'] as Timestamp).toDate()
            data['createdAt'] = (data['createdAt'] as Timestamp).toDate();
            const meet = data as Meet;

            if (meet.ownerId !== userId) {
                if (meet.status === 'canceled') {
                    continue;
                }
                
                const mm = meet.members.filter((m) => m.userId === userId);
                if (mm.length === 0) {
                    continue;
                }

                if (mm[0].status === 'waiting' || mm[0].status === 'declined') {
                    continue;
                }
            }

            meets.push(meet);
        }

        meets = meets.sort((a, b) => {
            const dateA = new Date(a.date as any).getTime();
            const dateB = new Date(b.date as any).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({ meets }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}