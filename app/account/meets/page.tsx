"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import Meets from './components/Meets/Meets';
import CreateMeetPortal from './components/CreateMeetPortal/CreateMeetPortal';
import MyApplications from './components/MyApplications/MyApplications';
import { useAuth } from '@/app/_providers/AuthProvider';
import { Meet } from '@/models/Meet';

enum MeetsPageType {
    meets = "Поиск встречи",
    myApplications = "Встречи и заявки"
}

export default function AccountMeets() {
    const auth = useAuth();
    const [currentTab, setCurrentTab] = useState<MeetsPageType>(MeetsPageType.meets);
    const [similarMeets, setSimilarMeets] = useState<Meet[]>([]);

    useEffect(() => {
        const fetchSimilarMeets = async (userId: string) => {
            const r = await fetch(`/api/meets/${userId}/similar`);

            if (r.status === 200) {
                const data = await r.json();
                const meets = data["meets"] as Meet[];
                console.log(meets)
                setSimilarMeets(meets);
            } else {
                console.log("NO SIMILAR MEETs")
            }
        }

        if (auth.user) {
            fetchSimilarMeets(auth.user.uid);
        }
    }, [auth])

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