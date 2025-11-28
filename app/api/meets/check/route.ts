import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { sendNotificationToUser } from "@/app/actions";

export async function GET() {
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const q = query(
    collection(db, "meets"),
    where("status", "==", "plan")
  );

  const docs = await getDocs(q);

  for (const docSnap of docs.docs) {
    const meet = docSnap.data();
    const meetDate = meet.date.toDate();

    if (meetDate > now && meetDate <= oneDayLater) {
      for (const m of meet.members) {
        await sendNotificationToUser(m.userId, `Встреча "${meet.title}" уже завтра`);
      }

      await updateDoc(docSnap.ref, { notificationDayBeforeSent: true });
    }
  }

  return NextResponse.json({ ok: true });
}