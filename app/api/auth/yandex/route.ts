import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    const error = req.nextUrl.searchParams.get('error');

    if (error) {
        return NextResponse.json({ error }, { status: 400 })
    }

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const clientId = process.env.YANDEX_CLIENT_ID!;
    const secret = process.env.YANDEX_SECRET!;

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code
    });

    const response = await fetch('https://oauth.yandex.ru/token', {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`
        },
        body
    })

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        return NextResponse.json({ error: "token_exchange_failed", details: data }, { status: 400 });
    }

    return NextResponse.json(data);
}