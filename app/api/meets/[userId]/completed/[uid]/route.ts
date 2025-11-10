import { Meets } from "@/models/Meet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string, uid: string }> }) {
    const { userId, uid } = await params;

    if (!userId || !uid) {
        return NextResponse.json({ message: "User Id & current user Id is required" }, { status: 403 });
    }

    const base = req.nextUrl.origin;
    const response = await fetch(`${base}/api/meets/${userId}`);
    const data = await response.json();

    if (response.status === 200) {
        const allMeets = (data["meets"] ?? []) as Meets[];
        const meets = allMeets.filter((mm) => mm.members.includes(uid))
        const completed = meets.filter((mm) => mm.status === 'COMPLETED')
        return NextResponse.json({ completed: completed.length > 0 }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}