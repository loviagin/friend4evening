"use client";

import { User } from "@/models/User";
import { useEffect, useState } from "react";
import { Meet, ApplicationMemberStatus } from "@/models/Meet";
import UserCard from "@/components/UserCard/UserCard";
import styles from "./Participants.module.css";
import LoadingView from "@/components/LoadingView/LoadingView";
import { useAuth } from "@/app/_providers/AuthProvider";

type UserWithMemberId = User & { memberId: string };

export default function Participants({ meet }: { meet: Meet }) {
    const auth = useAuth();
    const [participants, setParticipants] = useState<UserWithMemberId[]>([]);
    const [waiting, setWaiting] = useState<UserWithMemberId[]>([]);
    const [invited, setInvited] = useState<UserWithMemberId[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const isOwner = auth.user?.uid === meet.ownerId;

    useEffect(() => {
        const fetchParticipants = async () => {
            const approvedMembers = meet.members.filter(m => m.status === ApplicationMemberStatus.approved);
            const waitingMembers = meet.members.filter(m => m.status === ApplicationMemberStatus.waiting);
            const invitedMembers = meet.members.filter(m => m.status === ApplicationMemberStatus.invited);

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
                            return { ...user, memberId: member.id } as UserWithMemberId;
                        }
                    } catch (error) {
                        console.error(`Failed to fetch user ${member.userId}`, error);
                    }
                    return null;
                });

                const users = await Promise.all(userPromises);
                return users.filter((u): u is UserWithMemberId => u !== null);
            };

            const approvedUsers = await fetchUsers(approvedMembers);
            const waitingUsers = await fetchUsers(waitingMembers);
            const invitedUsers = await fetchUsers(invitedMembers);

            setParticipants(approvedUsers);
            setWaiting(waitingUsers);
            setInvited(invitedUsers);
            setLoading(false);
        };

        fetchParticipants();
    }, [meet]);

    const handleMemberAction = async (memberId: string, action: 'approve' | 'decline' | 'remove') => {
        if (!isOwner) return;

        setActionLoading(memberId);
        try {
            const response = await fetch(`/api/meets/one/${meet.id}/member/${memberId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ action }),
            });

            if (response.status === 200) {
                window.location.reload();
            } else {
                alert('Ошибка при выполнении действия');
                setActionLoading(null);
            }
        } catch (error) {
            console.error('Error updating member:', error);
            alert('Ошибка при выполнении действия');
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <LoadingView />
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
                            <div
                                key={user.id}
                                className={`${user.id === meet.ownerId ? styles.ownerWrapper : ''}`}
                            >
                                {user.id === meet.ownerId && (
                                    <span className={styles.ownerBadge}>Организатор</span>
                                )}
                                <UserCard user={user} />
                                {isOwner && user.id !== meet.ownerId && (
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleMemberAction(user.memberId, 'remove')}
                                            disabled={actionLoading === user.memberId}
                                        >
                                            {actionLoading === user.memberId ? 'Удаление...' : 'Удалить'}
                                        </button>
                                    </div>
                                )}
                            </div>
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
                            <div key={user.id}>
                                <UserCard user={user} />
                                {isOwner && (
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.approveButton}
                                            onClick={() => handleMemberAction(user.memberId, 'approve')}
                                            disabled={actionLoading === user.memberId}
                                        >
                                            {actionLoading === user.memberId ? 'Принятие...' : 'Принять'}
                                        </button>
                                        <button
                                            className={styles.declineButton}
                                            onClick={() => handleMemberAction(user.memberId, 'decline')}
                                            disabled={actionLoading === user.memberId}
                                        >
                                            {actionLoading === user.memberId ? 'Отклонение...' : 'Отклонить'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {invited.length > 0 && (
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>
                        Отправлены приглашения ({invited.length})
                    </h3>
                    <div className={styles.grid}>
                        {invited.map((user) => (
                            <div key={user.id}>
                                <UserCard user={user} />
                                {isOwner && user.id !== meet.ownerId && (
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => handleMemberAction(user.memberId, 'remove')}
                                            disabled={actionLoading === user.memberId}
                                        >
                                            {actionLoading === user.memberId ? 'Удаление...' : 'Удалить'}
                                        </button>
                                    </div>
                                )}
                            </div>
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
