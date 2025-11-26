'use server'

import { db } from '@/lib/firebase'
import { PushSubscription } from '@/models/PushSubscription'
import { addDoc, collection, deleteDoc, getDocs, query, where } from 'firebase/firestore'
import webpush from 'web-push'

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