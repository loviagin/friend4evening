"use client"
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import styles from "./SettingsProfile.module.css";
import PushNotificationManager from "@/components/PushNotificationManager/PushNotificationManager";
import { unsubscribeUser } from "@/app/actions";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useState, useEffect } from "react";
import { User } from "@/models/User";
import Dropdown from "@/components/Dropdown/Dropdown";

type PrivacySetting = "everyone" | "friends";

export default function SettingsProfile() {
    const selfAuth = useAuth()
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [meetInvitesPrivacy, setMeetInvitesPrivacy] = useState<PrivacySetting>("everyone")
    const [messagesPrivacy, setMessagesPrivacy] = useState<PrivacySetting>("everyone")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            if (!selfAuth.user?.uid) return

            try {
                const response = await fetch(`/api/users/${selfAuth.user.uid}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                })
                const data = await response.json()
                setUser(data as User)

                // Parse privacy settings
                const privacy = data.privacy || []
                const meetInvites = privacy.includes("meetInvitesFriendsOnly") ? "friends" : "everyone"
                const messages = privacy.includes("messagesFriendsOnly") ? "friends" : "everyone"
                setMeetInvitesPrivacy(meetInvites)
                setMessagesPrivacy(messages)
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [selfAuth.user])

    const handleLogout = () => {
        unsubscribeFromPush()
    }

    async function unsubscribeFromPush() {
        if (!selfAuth.user || !subscription) return

        await subscription.unsubscribe()
        await unsubscribeUser(selfAuth.user.uid)
        signOut(auth)
    }

    const handleSubscriptionChange = (newSab: PushSubscription | null) => {
        setSubscription(newSab);
    }

    const updatePrivacySetting = async (setting: "meetInvites" | "messages", value: PrivacySetting) => {
        if (!selfAuth.user?.uid || !user) return

        const currentPrivacy = user.privacy || []
        let newPrivacy = [...currentPrivacy]

        // Store previous values for rollback
        const prevMeetInvites = meetInvitesPrivacy
        const prevMessages = messagesPrivacy

        if (setting === "meetInvites") {
            setMeetInvitesPrivacy(value)
            newPrivacy = newPrivacy.filter(p => p !== "meetInvitesFriendsOnly")
            if (value === "friends") {
                newPrivacy.push("meetInvitesFriendsOnly")
            }
        } else if (setting === "messages") {
            setMessagesPrivacy(value)
            newPrivacy = newPrivacy.filter(p => p !== "messagesFriendsOnly")
            if (value === "friends") {
                newPrivacy.push("messagesFriendsOnly")
            }
        }

        try {
            const response = await fetch(`/api/users/${selfAuth.user.uid}/privacy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ privacy: newPrivacy }),
            })

            if (response.status === 200) {
                setUser({ ...user, privacy: newPrivacy })
            } else {
                const errorData = await response.json().catch(() => ({}))
                console.error("Failed to update privacy settings", response.status, errorData)
                // Revert state on error
                if (setting === "meetInvites") {
                    setMeetInvitesPrivacy(prevMeetInvites)
                } else {
                    setMessagesPrivacy(prevMessages)
                }
            }
        } catch (error) {
            console.error("Error updating privacy settings:", error)
            // Revert state on error
            if (setting === "meetInvites") {
                setMeetInvitesPrivacy(prevMeetInvites)
            } else {
                setMessagesPrivacy(prevMessages)
            }
        }
    }

    const defaultOptions = [
        { key: "everyone", label: "Всем" },
        { key: "friends", label: "Только друзьям" },
    ]

    return (
        <section className={styles.section}>
            <PushNotificationManager sub={subscription} setSub={handleSubscriptionChange} />
            {!loading && (
                <>
                    <div className={styles.privacyBlock}>
                        <h3 className={styles.privacyTitle}>Настройки приватности</h3>
                        <div className={styles.settingBlock}>
                            <span className={styles.settingText}>Разрешить приглашать на встречи</span>
                            <Dropdown
                                source={defaultOptions}
                                current={meetInvitesPrivacy}
                                onChange={(value) => updatePrivacySetting("meetInvites", value as PrivacySetting)}
                            />
                        </div>
                        <div className={styles.settingBlock}>
                            <span className={styles.settingText}>Разрешить отправку сообщений</span>
                            <Dropdown
                                source={defaultOptions}
                                current={messagesPrivacy}
                                onChange={(value) => updatePrivacySetting("messages", value as PrivacySetting)}
                            />
                        </div>
                    </div>
                </>
            )}
            <div className={styles.settingBlock}>
                <span className={styles.settingText}>Нужна помощь?</span>
                <button className={styles.button}>Написать в службу поддержки</button>
            </div>
            <div className={styles.settingBlock}>
                <span className={styles.settingText}>Запросить удаление аккаунта</span>
                <button className={styles.button}>Запросить</button>
            </div>
            <div className={styles.logoutBlock}>
                <button className={styles.logoutButton} onClick={handleLogout}>Выйти из аккаунта</button>
            </div>
        </section>
    )
}