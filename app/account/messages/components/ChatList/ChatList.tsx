"use client"

import { useAuth } from "@/app/_providers/AuthProvider";
import { Chat } from "@/models/Chat";
import { User } from "@/models/User";
import { useEffect, useState } from "react";
import styles from './ChatList.module.css';

interface ChatListProps {
    chats: Chat[];
    selectedChatId: string | null;
    onChatSelect: (chatId: string) => void;
}

export default function ChatList({ chats, selectedChatId, onChatSelect }: ChatListProps) {
    const auth = useAuth();
    const [users, setUsers] = useState<Record<string, User>>({});

    useEffect(() => {
        const fetchUsers = async () => {
            const userIds = new Set<string>();
            chats.forEach(chat => {
                chat.participants.forEach(id => userIds.add(id));
            });

            const userPromises = Array.from(userIds).map(async (userId) => {
                try {
                    const r = await fetch(`/api/users/${userId}`);
                    if (r.status === 200) {
                        const user = await r.json() as User;
                        return [userId, user] as [string, User];
                    }
                } catch (error) {
                    console.error(`Failed to fetch user ${userId}`, error);
                }
                return null;
            });

            const userResults = await Promise.all(userPromises);
            const usersMap: Record<string, User> = {};
            userResults.forEach(result => {
                if (result) {
                    usersMap[result[0]] = result[1];
                }
            });
            setUsers(usersMap);
        };

        if (chats.length > 0) {
            fetchUsers();
        }
    }, [chats]);

    const getOtherParticipant = (chat: Chat, currentUserId: string): User | null => {
        const otherId = chat.participants.find(id => id !== currentUserId);
        return otherId ? users[otherId] || null : null;
    };

    const formatDate = (date?: Date) => {
        if (!date) return '';
        const now = new Date();
        const messageDate = new Date(date);
        const diff = now.getTime() - messageDate.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return messageDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return 'Вчера';
        } else if (days < 7) {
            return messageDate.toLocaleDateString('ru-RU', { weekday: 'short' });
        } else {
            return messageDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        }
    };

    const currentUserId = auth.user?.uid || '';

    if (chats.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>У вас пока нет чатов</p>
            </div>
        );
    }

    return (
        <div className={styles.chatList}>
            <h2 className={styles.title}>Чаты</h2>
            <div className={styles.chats}>
                {chats.map((chat) => {
                    const otherUser = getOtherParticipant(chat, currentUserId);
                    const isSelected = selectedChatId === chat.id;

                    return (
                        <div
                            key={chat.id}
                            className={`${styles.chatItem} ${isSelected ? styles.chatItemSelected : ''}`}
                            onClick={() => onChatSelect(chat.id)}
                        >
                            {otherUser && (
                                <>
                                    <div className={styles.avatar}>
                                        <img src={otherUser.avatarUrl} alt={otherUser.name} />
                                    </div>
                                    <div className={styles.chatInfo}>
                                        <div className={styles.chatHeader}>
                                            <h3 className={styles.chatName}>{otherUser.name}</h3>
                                            {chat.lastMessageAt && (
                                                <span className={styles.chatTime}>
                                                    {formatDate(chat.lastMessageAt)}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.chatPreview}>
                                            <p className={styles.lastMessage}>
                                                {chat.lastMessage?.text || 'Нет сообщений'}
                                            </p>
                                            {chat.unreadCount && chat.unreadCount > 0 && (
                                                <span className={styles.unreadBadge}>
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
