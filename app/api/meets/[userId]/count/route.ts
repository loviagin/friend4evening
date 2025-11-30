import { Meet } from "@/models/Meet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    const base = req.nextUrl.origin;
    const response = await fetch(`${base}/api/meets/${userId}`, {
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
        },
    });
    const data = await response.json();

    if (response.status === 200) {
        let allMeets = (data["meets"] ?? []) as Meet[];
        allMeets = allMeets.filter((m) => m.status === 'completed')
        return NextResponse.json({ count: allMeets.length }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}