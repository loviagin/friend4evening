'use client'

import { sendNotification, subscribeUser, unsubscribeUser, WebPushSubscription } from '@/app/actions'
import { useState, useEffect } from 'react'
import styles from './PushNotificationManager.module.css'

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

export default function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(
        null
    )
    const [message, setMessage] = useState('')

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
    }

    async function subscribeToPush() {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
            ),
        })
        setSubscription(sub)
        const serializedSub: WebPushSubscription = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
                p256dh: (sub as any).toJSON().keys.p256dh,
                auth: (sub as any).toJSON().keys.auth,
            },
        }
        await subscribeUser(serializedSub)
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    async function sendTestNotification() {
        if (subscription) {
            await sendNotification(message)
            setMessage('')
        }
    }

    if (!isSupported) {
        return (
            <div className={styles.notSupported}>
                Push notifications are not supported in this browser.
            </div>
        )
    }

    return (
        <>
            {subscription ? (
                <>
                    <div className={styles.settingBlock}>
                        <span className={styles.settingText}>Вы подписаны на push-уведомления</span>
                        <button className={styles.buttonSecondary} onClick={unsubscribeFromPush}>
                            Отписаться
                        </button>
                    </div>
                    {/* <div className={styles.testBlock}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Введите сообщение для тестового уведомления"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className={styles.testButtonWrapper}>
                            <button className={styles.button} onClick={sendTestNotification}>
                                Отправить тест
                            </button>
                        </div>
                    </div> */}
                </>
            ) : (
                <div className={styles.settingBlock}>
                    <span className={styles.settingText}>Вы не подписаны на push-уведомления</span>
                    <button className={styles.button} onClick={subscribeToPush}>
                        Подписаться
                    </button>
                </div>
            )}
        </>
    )
}