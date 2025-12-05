"use client"

import GeneralProfile from "@/app/account/profile/components/GeneralProfile/GeneralProfile";
import { User } from "@/models/User";
import { useEffect, useState } from "react";
import HeroProfile from "@/app/account/profile/components/HeroProfile/HeroProfile";
import BlockedProfile from "@/app/account/profile/components/BlockedProfile/BlockedProfile";
import Friends from "@/app/account/profile/components/Friends/Friends";
import { useTranslations } from "next-intl";
import styles from "./UserProfilePage.module.css";

enum ProfileTab {
    general,
    friends
}

type Props = {
    nickname: string
}

export default function UserProfilePage({ nickname }: Props) {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<User | null>(null);
    const [tab, setTab] = useState<ProfileTab>(ProfileTab.general);

    useEffect(() => {
        if (nickname) {
            const fetchUserByNickname = async () => {
                const response = await fetch(`/api/profile/${nickname}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                })
                const data = await response.json();
                console.log(data["user"] as User);
                setUser(data["user"] as User);
            }

            fetchUserByNickname()
        }
    }, [nickname])

    let content;
    switch (tab) {
        case ProfileTab.general:
            content = <GeneralProfile user={user} />
            break;
        case ProfileTab.friends:
            content = user ? <Friends user={user} /> : <>{t('loading')}</>
            break;
        default:
            break;
    }

    if (user && user.blocked === true) {
        return (
            <BlockedProfile />
        )
    }

    return (
        <div className={styles.container}>
            <HeroProfile user={user} />

            <hr className={styles.divider} />

            {/* navigation */}
            <section className={styles.navigation}>
                <button
                    className={`${styles.navButton} ${tab === ProfileTab.general ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(ProfileTab.general)}
                >
                    {t('navigation.general')}
                </button>
                <button
                    className={`${styles.navButton} ${tab === ProfileTab.friends ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(ProfileTab.friends)}
                >
                    {t('navigation.friends')}
                </button>
            </section>

            {/* navigation content */}
            <section className={styles.content} id='profile-content'>
                {content}
            </section>
        </div>
    )
}