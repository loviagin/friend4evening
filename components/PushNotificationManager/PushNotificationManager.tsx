'use client'

import { subscribeUser, unsubscribeUser, WebPushSubscription } from '@/app/actions'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import styles from './PushNotificationManager.module.css'
import { useAuth } from '@/app/_providers/AuthProvider'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export default function PushNotificationManager({
    sub, setSub
}: {
    sub: PushSubscription | null,
    setSub: (newSab: PushSubscription | null) => void
}) {
    const auth = useAuth();
    const t = useTranslations('PushNotificationManager');
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
        })
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
        setSub(sub);
    }

    async function subscribeToPush() {
        if (!auth.user) return

        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
            ),
        })
        setSubscription(sub);
        setSub(sub);
        const serializedSub: WebPushSubscription = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
                p256dh: (sub as any).toJSON().keys.p256dh,
                auth: (sub as any).toJSON().keys.auth,
            },
        }
        await subscribeUser(serializedSub, auth.user.uid)
    }

    async function unsubscribeFromPush() {
        if (!auth.user || !subscription) return

        await subscription?.unsubscribe()
        setSubscription(null);
        setSub(null);
        await unsubscribeUser(auth.user.uid)
    }

    if (!isSupported) {
        return (
            <div className={styles.notSupported}>
                {t('notSupported')}
            </div>
        )
    }

    return (
        <>
            {subscription ? (
                <>
                    <div className={styles.settingBlock}>
                        <span className={styles.settingText}>{t('subscribed')}</span>
                        <button className={styles.buttonSecondary} onClick={unsubscribeFromPush}>
                            {t('unsubscribe')}
                        </button>
                    </div>
                </>
            ) : (
                <div className={styles.settingBlock}>
                    <span className={styles.settingText}>{t('notSubscribed')}</span>
                    <button className={styles.button} onClick={subscribeToPush}>
                        {t('subscribe')}
                    </button>
                </div>
            )}
        </>
    )
}