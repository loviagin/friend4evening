"use client"
import { useState } from 'react';
import styles from './page.module.css'
import Meets from './components/Meets/Meets';
import CreateMeetPortal from './components/CreateMeetPortal/CreateMeetPortal';
import MyApplications from './components/MyApplications/MyApplications';

enum MeetsPageType {
    meets = "Поиск встречи",
    myApplications = "Встречи и заявки"
}

export default function AccountMeets() {
    const [currentTab, setCurrentTab] = useState<MeetsPageType>(MeetsPageType.meets);

    let content;
    switch (currentTab) {
        case MeetsPageType.meets:
            content = <Meets />
            break;
        case MeetsPageType.myApplications:
            content = <MyApplications />
            break;
        default:
            break;
    }

    return (
        <main className={styles.container}>
            <h1>{currentTab.toString()}</h1>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.meets ? styles.tabButtonActive : ''}`}
                    onClick={() => setCurrentTab(MeetsPageType.meets)}
                >
                    Поиск встречи
                </button>
                <button
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.myApplications ? styles.tabButtonActive : ''}`}
                    onClick={() => setCurrentTab(MeetsPageType.myApplications)}
                >
                    Встречи и заявки
                </button>

                <CreateMeetPortal />
            </div>

            <div className={styles.content}>
                {content}
            </div>
        </main>
    );
}