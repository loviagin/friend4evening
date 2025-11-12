import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export type EmailSend = {
    to: string[],
    subject: string,
    html: string
}

export async function POST(req: NextRequest) {
    const { to, subject, html }: EmailSend = await req.json();

    const key = process.env.RESEND_API_KEY
    if (!key || !to || !subject || !html) {
        return NextResponse.json({ message: "No api key" }, { status: 403 })
    }

    const resend = new Resend(key!);
    const response = await resend.emails.send({
        from: 'Friends4Evening <noreply@f4e.io>',
        to,
        subject,
        html,
    })

    return NextResponse.json({ id: response.error?.message }, { status: 200 })
}