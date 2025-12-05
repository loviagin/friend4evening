"use client";

import { User } from "@/models/User";
import { useEffect, useState } from "react";
import { ApplicationMemberStatus, Meet } from "@/models/Meet";
import styles from "./InviteUser.module.css";
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { useAuth } from "@/app/_providers/AuthProvider";
import InviteUserCard from "./components/InviteUserCard/InviteUserCard";
import { useTranslations } from 'next-intl';

export default function InviteUser({ meet, onClose }: { meet: Meet, onClose: () => void }) {
    const auth = useAuth();
    const t = useTranslations('InviteUser');
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [inviteLoading, setInviteLoading] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAvailableUsers = async (query: string = '') => {
        setLoading(true);
        try {
            const url = `/api/users/${auth.user?.uid || ''}/search?q=${encodeURIComponent(query)}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                const allUsers = data.users as User[];
                // Фильтруем пользователей: исключаем уже участников и текущего пользователя
                const memberUserIds = new Set(meet.members.map(m => m.userId));
                const filteredUsers = allUsers.filter(user => 
                    !memberUserIds.has(user.id)
                );
                setAvailableUsers(filteredUsers);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // При инициализации делаем пустой запрос (первые 10 пользователей)
    useEffect(() => {
        fetchAvailableUsers('');
    }, [meet.members, auth.user?.uid]);

    const handleSearch = () => {
        fetchAvailableUsers(searchQuery);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleInviteUser = async (userId: string) => {
        setInviteLoading(userId);
        try {
            const response = await fetch(`/api/meets/one/${meet.id}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ userId }),
            });

            if (response.status === 200) {
                const data = await response.json();
                const id = data.id;
                meet.members.push({
                    id: id,
                    userId: userId,
                    status: ApplicationMemberStatus.invited
                });
                meet.memberIds.push(userId);
                fetchAvailableUsers('');
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || t('errors.inviteError'));
                setInviteLoading(null);
            }
        } catch (error) {
            console.error('Error inviting user:', error);
            alert(t('errors.inviteError'));
            setInviteLoading(null);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>{t('title')}</h3>
                    <button
                        className={styles.modalCloseButton}
                        onClick={onClose}
                    >
                        <AiOutlineClose />
                    </button>
                </div>
                <div className={styles.modalSearch}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className={styles.searchInput}
                        />
                        <button
                            className={styles.searchButton}
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            <AiOutlineSearch />
                        </button>
                    </div>
                </div>
                <div className={styles.modalUsersList}>
                    {loading ? (
                        <div className={styles.emptyState}>
                            {t('emptyState.loading')}
                        </div>
                    ) : availableUsers.length === 0 ? (
                        <div className={styles.emptyState}>
                            {t('emptyState.noUsers')}
                        </div>
                    ) : (
                        availableUsers.map((user) => (
                            <InviteUserCard
                                key={user.id}
                                user={user}
                                onInvite={() => handleInviteUser(user.id)}
                                loading={inviteLoading === user.id}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
