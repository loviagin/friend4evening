import { NextRequest, NextResponse, userAgent } from 'next/server'

export function GET(req: NextRequest) {
    const { device } = userAgent(req);

    return NextResponse.json({ message: device.type || 'desktop' }, { status: 200 });
}