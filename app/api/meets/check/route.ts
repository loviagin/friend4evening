import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, updateDoc, doc, Timestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { sendNotificationToUser } from "@/app/actions";
import { Notification } from "@/models/Notification";
import { User } from "@/models/User";
import { MeetIsSoon } from "@/emails/MeetIsSoon/MeetIsSoon";
import { Meet } from "@/models/Meet";

const base = process.env.NEXT_PUBLIC_URL!

export async function GET() {
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const q = query(
    collection(db, "meets"),
    where("status", "==", "plan"),
    where("blocked", "==", false)
  );

  const docs = await getDocs(q);

  for (const docSnap of docs.docs) {
    const meet = docSnap.data();
    const meetDate = (meet.date as Timestamp).toDate();

    if (meetDate > now && meetDate <= oneDayLater) {
      for (const m of meet.members) {
        await sendNotificationToUser(m.userId, `Встреча "${meet.title}" уже завтра`);

        if (m !== meet.ownerId) {
          await sendEmailAndSiteNotification(meet.id, m, "Откройте встречу, чтобы уточнить время, место и другую информацию", meet as Meet);
        }
      }

      await sendEmailAndSiteNotification(meet.id, meet.ownerId, "Выберете участников, если еще не выбрали", meet as Meet);
    }
  }

  return NextResponse.json({ ok: true });
}

async function sendEmailAndSiteNotification(id: string, userId: string, description: string, meet: Meet) {
  const ref = doc(db, "users", userId, "notifications");

  const notification: Notification = {
    id: ref.id,
    senderId: "admin",
    type: "meet-soon",
    title: `Встреча "${meet.title}" уже завтра`,
    description,
    url: id,
    createdAt: new Date(),
    readAt: null,
  }

  await setDoc(ref, {
    ...notification
  })

  const response2 = await fetch(`${base}/api/users/${userId}`);
  const u = await response2.json() as User

  if (u.email) {
    const emailComponent = MeetIsSoon({
      userName: u.name,
      meetId: meet.id,
      meetTitle: meet.title,
      meetDate: meet.date,
      meetLocation: meet.location,
      meetDescription: meet.description
    })

    // Dynamic import to avoid Next.js build issues
    const { renderToStaticMarkup } = await import("react-dom/server");
    const html = renderToStaticMarkup(emailComponent);

    const resp = await fetch(`${base}/api/email`, {
      method: 'POST',
      body: JSON.stringify({
        to: [u.email],
        subject: "Скоро запланированная встреча",
        html
      })
    })
    const data = await resp.json();
    console.log(data)
  }
}