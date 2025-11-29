"use client"

import LoadingView from "@/components/LoadingView/LoadingView";
import MeetFullCard from "@/components/MeetFullCard/MeetFullCard";
import { Meet } from "@/models/Meet";
import { useEffect, useState } from "react";
import styles from "./MeetContent.module.css";
import Participants from "./components/Participants/Participants";
import Settings from "./components/Settings/Settings";

enum MeetTab {
    general,
    participants,
    settings
}

export default function MeetContent({ uid }: { uid: string }) {
    const [meet, setMeet] = useState<Meet | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<MeetTab>(MeetTab.general);

    useEffect(() => {
        const fetchMeet = async () => {
            const r = await fetch(`/api/meets/one/${uid}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            })

            if (r.status === 200) {
                const d = await r.json();
                const meet = d as Meet
                setMeet(meet);
            }
            setLoading(false);
        }

        fetchMeet();
    }, []);

    if (loading || !meet) {
        return (
            <LoadingView />
        )
    }

    let content;
    switch (tab) {
        case MeetTab.general:
            content = <MeetFullCard meet={meet} />;
            break;
        case MeetTab.participants:
            content = <Participants meet={meet} />;
            break;
        case MeetTab.settings:
            content = <Settings meet={meet} />;
            break;
        default:
            break;
    }

    return (
        <section className={styles.container}>
            <div className={styles.cardWrapper}>
                <MeetFullCard meet={meet} />
            </div>
            {/* navigation */}
            <section className={styles.navigation}>
                <button
                    className={`${styles.navButton} ${tab === MeetTab.general ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(MeetTab.general)}
                >
                    Основное
                </button>
                <button
                    className={`${styles.navButton} ${tab === MeetTab.participants ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(MeetTab.participants)}
                >
                    Участники
                </button>
                <button
                    className={`${styles.navButton} ${tab === MeetTab.settings ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(MeetTab.settings)}
                >
                    Настройки
                </button>
            </section>

            {/* navigation content */}
            <section className={styles.content}>
                {content}
            </section>
        </section>
    );
}