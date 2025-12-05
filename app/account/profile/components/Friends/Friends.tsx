"use client";

import { User } from "@/models/User";
import { useEffect, useState } from "react";
import UserCard from "@/components/UserCard/UserCard";
import { useTranslations } from "next-intl";
import styles from "./Friends.module.css";

export default function Friends({ user }: { user: User }) {
    const t = useTranslations('Friends');
    const [friends, setFriends] = useState<User[]>([]);

    useEffect(() => {
        const fetchFriends = (ids: string[]) => {
            console.log(ids)

            setFriends([]);
            ids.forEach(async (i) => {
                const r = await fetch(`/api/users/${i}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                })

                if (r.status === 200) {
                    const d = await r.json();
                    const user1 = d as User;

                    setFriends(prev =>
                        prev.some(f => f.id === user1.id)
                            ? prev
                            : [...prev, user1]
                    );
                }
            });
        }

        if (user && user.friends?.length) {
            fetchFriends(user.friends);
        }
    }, [user])

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>{t('title')}</h1>
            {friends.length === 0 ? (
                <div className={styles.emptyState}>
                    {t('emptyState')}
                </div>
            ) : (
                <div className={styles.friendsGrid}>
                    {friends.map((friend) => (
                        <UserCard key={friend.id} user={friend} />
                    ))}
                </div>
            )}
        </main>
    )
}