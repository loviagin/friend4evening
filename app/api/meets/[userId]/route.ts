import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

//GETTING SELF MEETS BY USER ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    const q = query(collection(db, "meets"), where("ownerId", "==", userId));
    const documents = await getDocs(q);

    if (documents.docs.length > 0) {
        const meets = documents.docs.map((ap) => {
            const application = ap.data()

            if (application.blocked != null) {
                console.log("SKIP blocked", application.id);
                return null;
            }

            const time = application['date'] as Timestamp
            const created = application['createdAt'] as Timestamp
            application.date = time.toDate()
            application.createdAt = created.toDate();

            return application;
        })
            .filter((u): u is typeof u & {} => u !== null)
            .sort((a, b) => {
                const dateA = new Date(a.date as any).getTime();
                const dateB = new Date(b.date as any).getTime();
                return dateB - dateA;
            });

        return NextResponse.json({ meets }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}