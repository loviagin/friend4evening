"use client"
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import styles from "./SettingsProfile.module.css";
import PushNotificationManager from "@/components/PushNotificationManager/PushNotificationManager";
import { unsubscribeUser } from "@/app/actions";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useState } from "react";

export default function SettingsProfile() {
    const selfAuth = useAuth()
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)

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

    return (
        <section className={styles.section}>
            <PushNotificationManager sub={subscription} setSub={handleSubscriptionChange} />
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