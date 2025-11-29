import { db } from "@/lib/firebase";
import { MeetStatus } from "@/models/Meet";
import { differenceInMinutes } from "date-fns";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

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
        const update: Record<string, any> = {
            status: status
        }

        if (status === MeetStatus.current) {
            update["date"] = Timestamp.fromDate(new Date());
        }

        if (status === MeetStatus.completed) {
            // Получаем данные встречи для вычисления длительности
            const meetDoc = await getDoc(doc(db, "meets", uid));
            if (!meetDoc.exists()) {
                return NextResponse.json({ message: "Meet not found" }, { status: 404 });
            }

            const meetData = meetDoc.data();
            const meetDate = (meetData["date"] as Timestamp).toDate();
            const now = new Date();
            
            // Вычисляем длительность в минутах
            const durationMinutes = differenceInMinutes(now, meetDate);
            
            // Форматируем в человекоподобный вид
            update["duration"] = formatDuration(durationMinutes);
        }

        await updateDoc(doc(db, "meets", uid), update);

        return NextResponse.json({ message: "Status updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating meet status:", error);
        return NextResponse.json({ message: "Error updating meet status" }, { status: 500 });
    }
}
