import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export type ContactFormData = {
    name: string;
    email: string;
    message: string;
}

export async function POST(req: NextRequest) {
    try {
        const { name, email, message }: ContactFormData = await req.json();

        // Валидация
        if (!name || !email || !message) {
            return NextResponse.json(
                { message: "Все поля обязательны для заполнения" },
                { status: 400 }
            );
        }

        // Проверка email формата
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Некорректный формат email" },
                { status: 400 }
            );
        }

        const key = process.env.RESEND_API_KEY;
        if (!key) {
            return NextResponse.json(
                { message: "Email service не настроен" },
                { status: 500 }
            );
        }

        const resend = new Resend(key);
        
        // Формируем HTML письма
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #466C95 0%, #5DAE8B 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }
                    .content {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 0 0 10px 10px;
                    }
                    .field {
                        margin-bottom: 15px;
                    }
                    .label {
                        font-weight: bold;
                        color: #466C95;
                        display: block;
                        margin-bottom: 5px;
                    }
                    .value {
                        background: white;
                        padding: 10px;
                        border-radius: 5px;
                        border-left: 3px solid #5DAE8B;
                    }
                    .message {
                        white-space: pre-wrap;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Новое сообщение с сайта Friends4Evening</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <span class="label">Имя:</span>
                        <div class="value">${name}</div>
                    </div>
                    <div class="field">
                        <span class="label">Email:</span>
                        <div class="value">${email}</div>
                    </div>
                    <div class="field">
                        <span class="label">Сообщение:</span>
                        <div class="value message">${message.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const response = await resend.emails.send({
            from: 'Friends4Evening <noreply@f4e.io>',
            to: ['Friends4Evening@lovigin.com'],
            subject: `Новое сообщение с сайта от ${name}`,
            html,
        });

        if (response.error) {
            console.error('Resend error:', response.error);
            return NextResponse.json(
                { message: "Ошибка при отправке сообщения" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Сообщение успешно отправлено", id: response.data?.id },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { message: "Внутренняя ошибка сервера" },
            { status: 500 }
        );
    }
}
