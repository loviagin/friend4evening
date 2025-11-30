import { Meet } from "@/models/Meet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string, uid: string }> }) {
    const { userId, uid } = await params;

    if (!userId || !uid) {
        return NextResponse.json({ message: "User Id & current user Id is required" }, { status: 403 });
    }

    const base = req.nextUrl.origin;
    const response = await fetch(`${base}/api/meets/${userId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
        },
    });
    const data = await response.json();

    if (response.status === 200) {
        const allMeets = (data["meets"] ?? []) as Meet[];
        const meets = allMeets.filter((mm) => mm.members.some(member => member.userId === uid && member.status === 'approved'))
        const completed = meets.filter((mm) => mm.status === 'completed')
        return NextResponse.json({ completed: completed.length > 0 }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}