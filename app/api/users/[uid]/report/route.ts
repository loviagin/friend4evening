import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

type ReportDTO = {
    reason: string;
    description: string;
    reporterId: string;
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    const { uid } = await params;
    const data = await req.json();
    const report = data as ReportDTO;

    if (!uid) {
        return NextResponse.json({ message: "User ID is required" }, { status: 403 });
    }

    if (!report || !report.reason || !report.description || !report.reporterId) {
        return NextResponse.json({ message: "Report data is required" }, { status: 403 });
    }

    if (uid === report.reporterId) {
        return NextResponse.json({ message: "Cannot report yourself" }, { status: 403 });
    }

    try {
        const ref = doc(collection(db, "reports"));
        
        const newReport = {
            id: ref.id,
            reportedUserId: uid,
            reporterId: report.reporterId,
            reason: report.reason,
            description: report.description,
            createdAt: new Date(),
            status: "pending"
        };

        await setDoc(ref, newReport);
        return NextResponse.json({ id: ref.id }, { status: 200 });
    } catch (error) {
        console.error("Error creating report:", error);
        return NextResponse.json({ message: "Error creating report" }, { status: 500 });
    }
}
