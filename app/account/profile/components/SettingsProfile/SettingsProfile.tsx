import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import styles from "./SettingsProfile.module.css";
import PushNotificationManager from "@/components/PushNotificationManager/PushNotificationManager";

export default function SettingsProfile() {
    return (
        <section className={styles.section}>
            <PushNotificationManager />
            <div className={styles.settingBlock}>
                <span className={styles.settingText}>Нужна помощь?</span>
                <button className={styles.button}>Написать в службу поддержки</button>
            </div>
            <div className={styles.settingBlock}>
                <span className={styles.settingText}>Запросить удаление аккаунта</span>
                <button className={styles.button}>Запросить</button>
            </div>
            <div className={styles.logoutBlock}>
                <button className={styles.logoutButton} onClick={() => signOut(auth)}>Выйти из аккаунта</button>
            </div>
        </section>
    )
}