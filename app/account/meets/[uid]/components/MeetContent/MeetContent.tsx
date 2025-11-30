"use client"

import LoadingView from "@/components/LoadingView/LoadingView";
import MeetFullCard from "@/components/MeetFullCard/MeetFullCard";
import { ApplicationMember, Meet } from "@/models/Meet";
import { useEffect, useState } from "react";
import styles from "./MeetContent.module.css";
import Participants from "./components/Participants/Participants";
import Settings from "./components/Settings/Settings";
import General from "./components/General/General";
import { useAuth } from "@/app/_providers/AuthProvider";

enum MeetTab {
    general,
    participants,
    settings
}

export default function MeetContent({ uid }: { uid: string }) {
    const auth = useAuth();
    const [meet, setMeet] = useState<Meet | null>(null);
    const [loading, setLoading] = useState(true);
    const [blocked, setBlocked] = useState<string | null>(null);
    const [tab, setTab] = useState<MeetTab>(MeetTab.general);

    useEffect(() => {
        const fetchMeet = async (userId: string) => {
            const r = await fetch(`/api/meets/one/${uid}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            })

            if (r.status === 200) {
                const d = await r.json();
                const meet = d as Meet
                setMeet(meet);

                if (meet.type === 'closed') {
                    if (meet.members.filter((m) => m.userId === userId).length === 0) {
                        setBlocked("not-include")
                    } else {
                        const mm = meet.members.filter((m) => m.userId === userId)
                        if (mm.length > 0 && mm[0].status === 'declined') {
                            setBlocked("declined")
                        }
                    }
                }
            }
            setLoading(false);
        }

        if (auth.user) {
            fetchMeet(auth.user.uid);
        }
    }, [auth]);

    if (loading || !meet) {
        return (
            <LoadingView />
        )
    }

    if (blocked !== null) {
        return (
            <section className={styles.blockedSection}>
                <div className={styles.blockedContainer}>
                    <span className={styles.blockedIcon}>🚫</span>
                    <p className={styles.blockedMessage}>
                        Извините, Вам не разрешен просмотр этой встречи
                    </p>
                </div>
            </section>
        )
    }

    let content;
    switch (tab) {
        case MeetTab.general:
            content = <General meet={meet} />;
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