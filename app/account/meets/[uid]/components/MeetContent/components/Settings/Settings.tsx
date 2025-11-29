"use client";

import { Meet } from "@/models/Meet";
import styles from "./Settings.module.css";

export default function Settings({ meet }: { meet: Meet }) {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Настройки</h2>
            <div className={styles.content}>
                <p className={styles.placeholder}>
                    Настройки встречи будут доступны здесь
                </p>
            </div>
        </div>
    );
}
