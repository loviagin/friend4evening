import { db } from "@/lib/firebase";
import { MeetStatus, ApplicationMemberStatus, Meet } from "@/models/Meet";
import { differenceInMinutes } from "date-fns";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import { MeetStarted } from "@/emails/MeetStarted/MeetStarted";
import { MeetCompleted, Participant } from "@/emails/MeetCompleted/MeetCompleted";
import { MeetCancel } from "@/emails/MeetCancel/MeetCancel";
import { sendNotificationToUser } from "@/app/actions";

function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const hoursText = hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов';

    if (remainingMinutes === 0) {
        return `${hours} ${hoursText}`;
    }

    const minutesText = remainingMinutes === 1 ? 'минута' : remainingMinutes < 5 ? 'минуты' : 'минут';
    return `${hours} ${hoursText} ${remainingMinutes} ${minutesText}`;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { status } = await req.json();

    if (!uid) {
        return NextResponse.json({ message: "Meet ID is required" }, { status: 400 });
    }

    if (!status || !Object.values(MeetStatus).includes(status)) {
        return NextResponse.json({ message: "Valid status is required" }, { status: 400 });
    }

    try {
        const meetDoc = await getDoc(doc(db, "meets", uid));
        if (!meetDoc.exists()) {
            return NextResponse.json({ message: "Meet not found" }, { status: 404 });
        }
        const meetData = meetDoc.data();
        meetData["date"] = (meetData["date"] as Timestamp).toDate();

        const update: Record<string, any> = {
            status: status
        }

        if (status === MeetStatus.current) {
            update["date"] = Timestamp.fromDate(new Date());
            meetData["date"] = Timestamp.fromDate(new Date());
        }

        if (status === MeetStatus.completed) {
            const now = new Date();

            // Вычисляем длительность в минутах
            const durationMinutes = differenceInMinutes(now, meetData["date"]);

            // Форматируем в человекоподобный вид
            update["duration"] = formatDuration(durationMinutes);
            meetData["duration"] = formatDuration(durationMinutes);
        }

        await updateDoc(doc(db, "meets", uid), update);

        // Получаем обновленные данные встречи для отправки писем
        const updatedMeetDoc = await getDoc(doc(db, "meets", uid));
        if (updatedMeetDoc.exists()) {
            const updatedMeetData = updatedMeetDoc.data();
            updatedMeetData["date"] = (updatedMeetData["date"] as Timestamp).toDate();
            updatedMeetData["createdAt"] = (updatedMeetData["createdAt"] as Timestamp).toDate();
            
            // Отправляем письма участникам в фоне (не ждем завершения)
            sendEmailsToParticipants(uid, status, updatedMeetData as Meet).catch(error => {
                console.error("Error sending emails to participants:", error);
            });
        }

        return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating meet status:", error);
        return NextResponse.json({ message: "Error updating meet status" }, { status: 500 });
    }
}

async function sendEmailsToParticipants(meetId: string, status: MeetStatus, meetData: Meet) {
    const base = process.env.NEXT_PUBLIC_API_TOKEN ? process.env.NEXT_PUBLIC_URL! : 'http://localhost:3000';

    // Получаем всех участников со статусом approved
    const approvedMembers = meetData.members.filter(
        (m) => m.status === ApplicationMemberStatus.approved
    );

    console.log(`[Email] Sending emails for meet ${meetId}, status: ${status}, approved members: ${approvedMembers.length}`);

    if (approvedMembers.length === 0) {
        console.log(`[Email] No approved members found for meet ${meetId}`);
        return;
    }

    // Для MeetCompleted нужно получить данные всех участников
    let participantsData: Participant[] = [];
    if (status === MeetStatus.completed) {
        const participantsPromises = approvedMembers.map(async (member): Promise<Participant | null> => {
            try {
                const userDoc = await getDoc(doc(db, "users", member.userId));
                if (userDoc.exists()) {
                    const userData = userDoc.data() as User;
                    return {
                        userId: member.userId,
                        name: userData.name,
                        nickname: userData.nickname,
                        avatarUrl: userData.avatarUrl,
                    };
                }
            } catch (error) {
                console.error(`Error fetching user ${member.userId}:`, error);
            }
            return null;
        });
        const participantsResults = await Promise.all(participantsPromises);
        participantsData = participantsResults.filter((p): p is Participant => p !== null);
    }

    // Отправляем письма всем участникам
    const emailPromises = approvedMembers.map(async (member) => {
        try {
            console.log(`[Email] Processing member ${member.userId} for meet ${meetId}`);
            const userDoc = await getDoc(doc(db, "users", member.userId));
            if (!userDoc.exists()) {
                console.log(`[Email] User ${member.userId} not found`);
                return;
            }
            if (!userDoc.data().email) {
                console.log(`[Email] User ${member.userId} has no email`);
                return;
            }

            const userData = userDoc.data() as User;
            // Убеждаемся, что дата является Date объектом, а не Timestamp
            const meetDate = meetData.date instanceof Date 
                ? meetData.date 
                : (meetData.date as unknown as Timestamp).toDate();

            let emailComponent;
            let subject;

            if (status === MeetStatus.current) {
                emailComponent = MeetStarted({
                    userName: userData.name,
                    meetId: meetId,
                    meetTitle: meetData.title,
                    meetDate: meetDate,
                    meetLocation: meetData.location,
                    meetDescription: meetData.description,
                });
                subject = "Встреча началась | Friends4Evening";
            } else if (status === MeetStatus.completed) {
                emailComponent = MeetCompleted({
                    userName: userData.name,
                    meetId: meetId,
                    meetTitle: meetData.title,
                    meetDate: meetDate,
                    meetLocation: meetData.location,
                    meetDescription: meetData.description,
                    participants: participantsData,
                    currentUserId: member.userId,
                });
                subject = "Встреча завершена | Friends4Evening";
            } else if (status === MeetStatus.canceled) {
                emailComponent = MeetCancel({
                    userName: userData.name,
                    meetTitle: meetData.title,
                    meetDate: meetDate,
                    meetLocation: meetData.location,
                    meetDescription: meetData.description,
                });
                subject = "Встреча отменена | Friends4Evening";
            } else {
                return; // Не отправляем письма для других статусов
            }

            // Dynamic import to avoid Next.js build issues
            const { renderToStaticMarkup } = await import("react-dom/server");
            const html = renderToStaticMarkup(emailComponent);

            console.log(`[Email] Sending email to ${userData.email} for meet ${meetId}`);
            const response = await fetch(`${base}/api/email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: [userData.email!],
                    subject: subject,
                    html: html,
                }),
            });

            if (!response.ok) {
                console.error(`[Email] Failed to send email to ${userData.email}:`, await response.text());
            } else {
                console.log(`[Email] Successfully sent email to ${userData.email} for meet ${meetId}`);
            }

            // Отправляем webpush уведомление
            let pushMessage = '';
            if (status === MeetStatus.current) {
                pushMessage = `Встреча "${meetData.title}" началась`;
            } else if (status === MeetStatus.completed) {
                pushMessage = `Встреча "${meetData.title}" завершена`;
            } else if (status === MeetStatus.canceled) {
                pushMessage = `Встреча "${meetData.title}" отменена`;
            }

            if (pushMessage) {
                try {
                    await sendNotificationToUser(member.userId, pushMessage);
                    console.log(`[Push] Successfully sent push notification to ${member.userId} for meet ${meetId}`);
                } catch (error) {
                    console.error(`[Push] Error sending push notification to ${member.userId}:`, error);
                }
            }
        } catch (error) {
            console.error(`Error sending email to member ${member.userId}:`, error);
        }
    });

    // Выполняем отправку писем параллельно, но не ждем завершения
    await Promise.allSettled(emailPromises);
}
