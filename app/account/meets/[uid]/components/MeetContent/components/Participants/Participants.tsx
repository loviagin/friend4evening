"use client";

import { User } from "@/models/User";
import { useEffect, useState } from "react";
import { Meet, ApplicationMemberStatus } from "@/models/Meet";
import UserCard from "@/components/UserCard/UserCard";
import styles from "./Participants.module.css";

export default function Participants({ meet }: { meet: Meet }) {
    const [participants, setParticipants] = useState<User[]>([]);
    const [waiting, setWaiting] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParticipants = async () => {
            const approvedMembers = meet.members.filter(m => m.status === ApplicationMemberStatus.approved);
            const waitingMembers = meet.members.filter(m => m.status === ApplicationMemberStatus.waiting);

            const fetchUsers = async (members: typeof meet.members) => {
                const userPromises = members.map(async (member) => {
                    try {
                        const r = await fetch(`/api/users/${member.userId}`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                            },
                        });
                        if (r.status === 200) {
                            const user = await r.json() as User;
                            return user;
                        }
                    } catch (error) {
                        console.error(`Failed to fetch user ${member.userId}`, error);
                    }
                    return null;
                });

                const users = await Promise.all(userPromises);
                return users.filter((u): u is User => u !== null);
            };

            const approvedUsers = await fetchUsers(approvedMembers);
            const waitingUsers = await fetchUsers(waitingMembers);

            setParticipants(approvedUsers);
            setWaiting(waitingUsers);
            setLoading(false);
        };

        fetchParticipants();
    }, [meet]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {participants.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        Подтвержденные ({participants.length}{meet.membersCount ? ` / ${meet.membersCount}` : ''})
                    </h3>
                    <div className={styles.grid}>
                        {participants.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {waiting.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        Ожидают подтверждения ({waiting.length})
                    </h3>
                    <div className={styles.grid}>
                        {waiting.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {participants.length === 0 && waiting.length === 0 && (
                <div className={styles.emptyState}>
                    Участников пока нет
                </div>
            )}
        </div>
    );
}
