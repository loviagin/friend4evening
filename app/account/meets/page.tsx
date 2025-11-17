"use client"
import { useState } from 'react';
import styles from './page.module.css'
import Meets from './components/Meets/Meets';
import MyMeets from './components/MyMeets/MyMeets';

enum MeetsPageType {
    meets = "Поиск встречи",
    myMeets = "Мои встречи",
    myApplications = "Мои заявки"
}
export default function AccountMeets() {
    const [currentTab, setCurrentTab] = useState<MeetsPageType>(MeetsPageType.meets);

    let content;
    switch (currentTab) {
        case MeetsPageType.meets:
            content = <Meets />
            break;
        case MeetsPageType.myMeets:
            content = true ? <MyMeets /> : <>Загрузка...</>
            break;
        case MeetsPageType.myApplications:
            content = <MyMeets />
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
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.myMeets ? styles.tabButtonActive : ''}`}
                    onClick={() => setCurrentTab(MeetsPageType.myMeets)}
                >
                    Мои встречи
                </button>
                <button 
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.myApplications ? styles.tabButtonActive : ''}`}
                    onClick={() => setCurrentTab(MeetsPageType.myApplications)}
                >
                    Мои заявки
                </button>
            </div>

            <div className={styles.content}>
                {content}
            </div>
        </main>
    );
}