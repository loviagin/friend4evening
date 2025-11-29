"use client"

import { useAuth } from "@/app/_providers/AuthProvider"
import LoadingView from "@/components/LoadingView/LoadingView";
import { Notification } from "@/models/Notification";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import styles from './page.module.css'

export default function Notifications() {
    const auth = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotification = async (userId: string) => {
            const r = await fetch(`/api/notifications/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            })

            if (r.status === 200) {
                const data = await r.json()
                const notifications = data as Notification[];
                console.log(notifications)
                setNotifications(notifications);
            }

            setLoading(false)
        }

        if (auth.user) {
            fetchNotification(auth.user.uid)
        }
    }, [auth])

    const acceptFriend = async (notification: Notification) => {
        if (!auth.user) return
        setLoading(true)
        const r = await fetch(`/api/users/${auth.user.uid}/friend/accept/${notification.senderId}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
        })

        setNotifications((prev) => ([
            ...prev.map((n) => {
                if (n.id === notification.id) {
                    n.type = 'friend-request-processed'
                    return n
                }
                return n
            }),
        ]))
        setLoading(false);
        if (r.status === 200) {
            alert("Заявка успешно принята")
        } else {
            alert("Вы уже приняли или отклонили заявку")
        }
    }

    const declineFriend = async (notification: Notification) => {
        if (!auth.user) return
        setLoading(true)
        const r = await fetch(`/api/users/${auth.user.uid}/friend/decline/${notification.senderId}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
        })

        setNotifications((prev) => ([
            ...prev.map((n) => {
                if (n.id === notification.id) {
                    n.type = 'friend-request-processed'
                    return n
                }
                return n
            }),
        ]))
        setLoading(false);
        if (r.status === 200) {
            alert("Заявка отклонена")
        } else {
            alert("Вы уже приняли или отклонили заявку")
        }
    }

    if (loading === true) {
        return (
            <LoadingView />
        )
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Уведомления</h1>
            {notifications.length === 0 ? (
                <div className={styles.emptyState}>
                    <IoNotificationsOutline className={styles.emptyStateIcon} />
                    <p className={styles.emptyStateText}>У вас пока нет уведомлений</p>
                </div>
            ) : (
                <div className={styles.notificationsList}>
                    {notifications.map((notification) => (
                        <div key={notification.id} className={styles.notificationCard}>
                            <div className={styles.notificationIconWrapper}>
                                <IoNotificationsOutline className={styles.notificationIcon} />
                                {notification.readAt === null && (
                                    <span className={styles.unreadIndicator}></span>
                                )}
                            </div>
                            <div className={styles.notificationContent}>
                                <h3 className={styles.notificationTitle}>
                                    <Link
                                        href={createLink(notification.type, notification.url)}
                                        target="_blank"
                                        className={styles.notificationTitleLink}
                                    >
                                        {notification.title}
                                    </Link>
                                </h3>
                                {notification.description && (
                                    <p className={styles.notificationDescription}>
                                        {notification.description}
                                    </p>
                                )}
                                {notification.type === 'friend-request' && (
                                    <div className={styles.notificationActions}>
                                        <button
                                            className={styles.button}
                                            onClick={() => acceptFriend(notification)}
                                        >
                                            Принять заявку
                                        </button>
                                        <button
                                            className={styles.buttonSecondary}
                                            onClick={() => declineFriend(notification)}
                                        >
                                            Отклонить заявку
                                        </button>
                                    </div>
                                )}
                                <span className={styles.notificationDate}>
                                    {new Date(notification.createdAt).toLocaleDateString('ru-RU', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}

function createLink(type: string, id: string): string {
    if (type === 'friends' || type === 'friend-request' || type === 'friend-request-processed') {
        return `/profile/${id}`
    } else if (type === 'meet-soon') {
        return `/account/meets/${id}`
    }
    return '/'
}