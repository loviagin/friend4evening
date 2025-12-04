'use server'

import { db } from '@/lib/firebase'
import { PushSubscription } from '@/models/PushSubscription'
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore'
import webpush from 'web-push'
import { User } from '@/models/User'
import { Meet } from '@/models/Meet'
import { ApplicationApproved } from '@/emails/ApplicationApproved/ApplicationApproved'
import { ApplicationDeclined } from '@/emails/ApplicationDeclined/ApplicationDeclined'
import { InvitationAccepted } from '@/emails/InvitationAccepted/InvitationAccepted'
import { InvitationDeclined } from '@/emails/InvitationDeclined/InvitationDeclined'
import { doc, getDoc } from 'firebase/firestore'

export type WebPushSubscription = {
  endpoint: string
  expirationTime?: number | null
  keys: {
    p256dh: string
    auth: string
  }
}

webpush.setVapidDetails(
  'mailto:support@lovigin.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: WebPushSubscription | null = null

/**
  {
  endpoint: 'urlString',
  expirationTime: null,
  keys: {
    p256dh: 'str',
    auth: 'str'
  }
  }
 */
export async function subscribeUser(sub: WebPushSubscription, userId: string) {
  subscription = sub

  const pushSubscription: PushSubscription = {
    createdAt: new Date(),
    ...sub
  }

  await addDoc(collection(db, "users", userId, "devices"), pushSubscription);

  return { success: true }
}

export async function unsubscribeUser(userId: string) {
  if (!subscription) return;

  const q = query(collection(db, "users", userId, "devices"), where('endpoint', '==', subscription.endpoint))
  const snap = await getDocs(q);
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))

  subscription = null

  return { success: true }
}

export async function sendNotificationToUser(userId: string, message: string) {
  const snap = await getDocs(collection(db, 'users', userId, 'devices'))

  console.log("sending notification for", userId, message)
  if (snap.empty) {
    return { success: false, error: 'No subscriptions for this user' }
  }

  const payload = JSON.stringify({
    title: 'Friend4Evening',
    body: message,
    icon: '/icon.png',
  })

  const results = await Promise.all(
    snap.docs.map(async (docSnap) => {
      const subData = docSnap.data() as WebPushSubscription
      try {
        await webpush.sendNotification(subData, payload)
        console.log("NOTE SENT")
        return { ok: true }
      } catch (err: any) {
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await deleteDoc(docSnap.ref)
        }
        return { ok: false, error: err?.message }
      }
    })
  )

  const anyOk = results.some(r => r.ok)
  return { success: anyOk, results }
}

export async function sendEmailAndNotification(
  action: 'approve' | 'decline',
  memberUser: User,
  meet: Meet
) {
  const base = process.env.NEXT_PUBLIC_URL!;

  console.log('[sendEmailAndNotification] Starting:', { action, memberUserId: memberUser.id, memberUserEmail: memberUser.email, meetId: meet.id });

  try {
    // Преобразуем дату встречи
    const meetDate = meet.date instanceof Date
      ? meet.date
      : new Date(meet.date);

    let emailComponent;
    let subject;
    let notificationTitle;
    let notificationDescription;
    let notificationType;

    if (action === 'approve') {
      // Организатор подтвердил заявку
      emailComponent = ApplicationApproved({
        userName: memberUser.name,
        meetId: meet.id,
        meetTitle: meet.title,
        meetDate: meetDate,
        meetLocation: meet.location,
        meetDescription: meet.description,
      });
      subject = "Заявка одобрена | Friends4Evening";
      notificationTitle = `Заявка на встречу "${meet.title}" одобрена`;
      notificationDescription = "Ваша заявка была одобрена организатором";
      notificationType = "meet-application-approved";
    } else if (action === 'decline') {
      // Организатор отклонил заявку
      emailComponent = ApplicationDeclined({
        userName: memberUser.name,
        meetTitle: meet.title,
        meetDate: meetDate,
        meetLocation: meet.location,
        meetDescription: meet.description,
      });
      subject = "Заявка отклонена | Friends4Evening";
      notificationTitle = `Заявка на встречу "${meet.title}" отклонена`;
      notificationDescription = "К сожалению, ваша заявка была отклонена организатором";
      notificationType = "meet-application-declined";
    } else {
      return;
    }

    // Отправляем email
    if (memberUser.email) {
      try {
        console.log('[sendEmailAndNotification] Sending email to:', memberUser.email);
        const { renderToStaticMarkup } = await import("react-dom/server");
        const html = renderToStaticMarkup(emailComponent);

        const emailResponse = await fetch(`${base}/api/email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: [memberUser.email!],
            subject: subject,
            html: html,
          }),
        });

        if (!emailResponse.ok) {
          console.error('[sendEmailAndNotification] Error sending email:', await emailResponse.text());
        } else {
          console.log('[sendEmailAndNotification] Email sent successfully');
        }
      } catch (error) {
        console.error('[sendEmailAndNotification] Error sending email:', error);
      }
    } else {
      console.log('[sendEmailAndNotification] No email for user:', memberUser.id);
    }

    // Создаем уведомление в базе данных
    try {
      const notificationResponse = await fetch(`${base}/api/notifications/${memberUser.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: notificationType,
          title: notificationTitle,
          description: notificationDescription,
          senderId: meet.ownerId,
          meetId: meet.id,
          url: `${base}/account/meets/${meet.id}`,
        }),
      });

      if (!notificationResponse.ok) {
        console.error('Error creating notification:', await notificationResponse.text());
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }

    // Отправляем webpush уведомление
    try {
      console.log('[sendEmailAndNotification] Sending push notification to:', memberUser.id);
      const pushResult = await sendNotificationToUser(memberUser.id, notificationTitle);
      console.log('[sendEmailAndNotification] Push notification result:', pushResult);
    } catch (error) {
      console.error('[sendEmailAndNotification] Error sending push notification:', error);
    }
  } catch (error) {
    console.error('Error sending email/notification:', error);
  }
}

export async function sendInvitationResponseNotification(
  action: 'accepted' | 'declined',
  userId: string,
  meet: Meet
) {
  const base = process.env.NEXT_PUBLIC_URL!;

  console.log('[sendInvitationResponseNotification] Starting:', { action, userId, meetId: meet.id, ownerId: meet.ownerId });

  try {
    // Получаем данные пользователя, который принял/отклонил приглашение
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      console.log('[sendInvitationResponseNotification] User not found:', userId);
      return;
    }
    const userData = userDoc.data() as User;

    // Получаем данные организатора
    const organizerDoc = await getDoc(doc(db, "users", meet.ownerId));
    if (!organizerDoc.exists()) {
      console.log('[sendInvitationResponseNotification] Organizer not found:', meet.ownerId);
      return;
    }
    const organizerData = organizerDoc.data() as User;

    // Преобразуем дату встречи
    const meetDate = meet.date instanceof Date
      ? meet.date
      : new Date(meet.date);

    let emailComponent;
    let subject;
    let notificationTitle;
    let notificationDescription;
    let notificationType;

    if (action === 'accepted') {
      emailComponent = InvitationAccepted({
        organizerName: organizerData.name,
        userName: userData.name,
        meetId: meet.id,
        meetTitle: meet.title,
        meetDate: meetDate,
        meetLocation: meet.location,
        meetDescription: meet.description,
      });
      subject = "Приглашение принято | Friends4Evening";
      notificationTitle = `${userData.name} принял(а) ваше приглашение на встречу "${meet.title}"`;
      notificationDescription = `${userData.name} принял(а) ваше приглашение`;
      notificationType = "invitation-accepted";
    } else {
      emailComponent = InvitationDeclined({
        organizerName: organizerData.name,
        userName: userData.name,
        meetTitle: meet.title,
        meetDate: meetDate,
        meetLocation: meet.location,
        meetDescription: meet.description,
      });
      subject = "Приглашение отклонено | Friends4Evening";
      notificationTitle = `${userData.name} отклонил(а) ваше приглашение на встречу "${meet.title}"`;
      notificationDescription = `${userData.name} отклонил(а) ваше приглашение`;
      notificationType = "invitation-declined";
    }

    // Отправляем email организатору
    if (organizerData.email) {
      try {
        console.log('[sendInvitationResponseNotification] Sending email to organizer:', organizerData.email);
        const { renderToStaticMarkup } = await import("react-dom/server");
        const html = renderToStaticMarkup(emailComponent);

        const emailResponse = await fetch(`${base}/api/email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: [organizerData.email!],
            subject: subject,
            html: html,
          }),
        });

        if (!emailResponse.ok) {
          console.error('[sendInvitationResponseNotification] Error sending email:', await emailResponse.text());
        } else {
          console.log('[sendInvitationResponseNotification] Email sent successfully');
        }
      } catch (error) {
        console.error('[sendInvitationResponseNotification] Error sending email:', error);
      }
    } else {
      console.log('[sendInvitationResponseNotification] No email for organizer:', meet.ownerId);
    }

    // Создаем уведомление в базе данных
    try {
      const notificationResponse = await fetch(`${base}/api/notifications/${meet.ownerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: notificationType,
          title: notificationTitle,
          description: notificationDescription,
          senderId: userId,
          meetId: meet.id,
          url: `${base}/account/meets/${meet.id}`,
        }),
      });

      if (!notificationResponse.ok) {
        console.error('[sendInvitationResponseNotification] Error creating notification:', await notificationResponse.text());
      } else {
        console.log('[sendInvitationResponseNotification] Notification created successfully');
      }
    } catch (error) {
      console.error('[sendInvitationResponseNotification] Error creating notification:', error);
    }

    // Отправляем webpush уведомление
    try {
      console.log('[sendInvitationResponseNotification] Sending push notification to organizer:', meet.ownerId);
      const pushResult = await sendNotificationToUser(meet.ownerId, notificationTitle);
      console.log('[sendInvitationResponseNotification] Push notification result:', pushResult);
    } catch (error) {
      console.error('[sendInvitationResponseNotification] Error sending push notification:', error);
    }
  } catch (error) {
    console.error('[sendInvitationResponseNotification] Error:', error);
  }
}