import { db } from "@/lib/firebase";
import { ApplicationMemberStatus } from "@/models/Meet";
import { User } from "@/models/User";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { MeetInvitation } from "@/emails/MeetInvitation/MeetInvitation";
import { sendNotificationToUser } from "@/app/actions";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { userId } = await req.json();

    if (!uid || !userId) {
        return NextResponse.json({ message: "Meet ID and User ID are required" }, { status: 400 });
    }

    try {
        const meetDoc = await getDoc(doc(db, "meets", uid));
        if (!meetDoc.exists()) {
            return NextResponse.json({ message: "Meet not found" }, { status: 404 });
        }

        const meetData = meetDoc.data();
        const members = meetData.members || [];
        const memberIds = meetData.memberIds || [];

        // Проверяем, является ли пользователь уже участником
        const existingMember = members.find((m: any) => m.userId === userId);
        
        if (existingMember) {
            // Если пользователь уже участник, возвращаем ошибку
            return NextResponse.json({ message: "User is already a member" }, { status: 400 });
        }

        // Добавляем пользователя в members со статусом invited
        const id = randomUUID();
        const newMember = {
            id: id,
            userId: userId,
            status: ApplicationMemberStatus.invited
        };

        const updatedMembers = [...members, newMember];
        const updatedMemberIds = memberIds.includes(userId) ? memberIds : [...memberIds, userId];

        await updateDoc(doc(db, "meets", uid), {
            members: updatedMembers,
            memberIds: updatedMemberIds
        });

        // Отправляем email, уведомление и push в фоне
        void sendInvitationNotifications(uid, userId, meetData).catch((error) => {
            console.error('[Invite] Error sending background notifications:', error);
        });

        return NextResponse.json({ id: id }, { status: 200 });
    } catch (error) {
        console.error("Error inviting user:", error);
        return NextResponse.json({ message: "Error inviting user" }, { status: 500 });
    }
}

async function sendInvitationNotifications(meetId: string, invitedUserId: string, meetData: any) {
    const base = process.env.NEXT_PUBLIC_URL!;

    try {
        // Получаем данные приглашенного пользователя
        const invitedUserDoc = await getDoc(doc(db, "users", invitedUserId));
        if (!invitedUserDoc.exists()) {
            console.error(`[Invite] User ${invitedUserId} not found`);
            return;
        }

        const invitedUser = invitedUserDoc.data() as User;

        // Получаем данные организатора
        const organizerDoc = await getDoc(doc(db, "users", meetData.ownerId));
        if (!organizerDoc.exists()) {
            console.error(`[Invite] Organizer ${meetData.ownerId} not found`);
            return;
        }

        const organizer = organizerDoc.data() as User;

        // Преобразуем дату встречи
        const meetDate = meetData.date instanceof Date
            ? meetData.date
            : (meetData.date as unknown as Timestamp).toDate();

        const notificationTitle = `Вас пригласили на встречу "${meetData.title}"`;
        const notificationDescription = `${organizer.name} пригласил(а) вас на встречу`;

        // Отправляем email
        if (invitedUser.email) {
            try {
                console.log(`[Invite] Sending invitation email to ${invitedUser.email}`);
                const emailComponent = MeetInvitation({
                    userName: invitedUser.name,
                    organizerName: organizer.name,
                    meetId: meetId,
                    meetTitle: meetData.title,
                    meetDate: meetDate,
                    meetLocation: meetData.location,
                    meetDescription: meetData.description,
                });

                const { renderToStaticMarkup } = await import("react-dom/server");
                const html = renderToStaticMarkup(emailComponent);

                const emailResponse = await fetch(`${base}/api/email`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: [invitedUser.email],
                        subject: "Вас пригласили на встречу | Friends4Evening",
                        html: html,
                    }),
                });

                if (!emailResponse.ok) {
                    console.error('[Invite] Error sending email:', await emailResponse.text());
                } else {
                    console.log('[Invite] Email sent successfully');
                }
            } catch (error) {
                console.error('[Invite] Error sending email:', error);
            }
        } else {
            console.log(`[Invite] User ${invitedUserId} has no email`);
        }

        // Создаем уведомление в базе данных
        try {
            const notificationResponse = await fetch(`${base}/api/notifications/${invitedUserId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "meet-invitation",
                    title: notificationTitle,
                    description: notificationDescription,
                    senderId: meetData.ownerId,
                    meetId: meetId,
                    url: `${base}/account/meets/${meetId}`,
                }),
            });

            if (!notificationResponse.ok) {
                console.error('[Invite] Error creating notification:', await notificationResponse.text());
            } else {
                console.log('[Invite] Notification created successfully');
            }
        } catch (error) {
            console.error('[Invite] Error creating notification:', error);
        }

        // Отправляем push уведомление
        try {
            console.log(`[Invite] Sending push notification to ${invitedUserId}`);
            const pushResult = await sendNotificationToUser(invitedUserId, notificationTitle);
            console.log('[Invite] Push notification result:', pushResult);
        } catch (error) {
            console.error('[Invite] Error sending push notification:', error);
        }
    } catch (error) {
        console.error('[Invite] Error in sendInvitationNotifications:', error);
    }
}
