"use client"

import { useAuth } from "@/app/_providers/AuthProvider";
import { Message } from "@/models/Chat";
import { User } from "@/models/User";
import { useEffect, useState, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
    chatId: string;
    onBack: () => void;
}

export default function ChatWindow({ chatId, onBack }: ChatWindowProps) {
    const auth = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                // TODO: Заменить на реальный API endpoint
                const r = await fetch(`/api/messages/chat/${chatId}`);
                
                if (r.status === 200) {
                    const data = await r.json();
                    setMessages(data.messages || []);
                    
                    // Получаем информацию о другом участнике
                    if (data.participants && auth.user) {
                        const otherId = data.participants.find((id: string) => id !== auth.user?.uid);
                        if (otherId) {
                            const userR = await fetch(`/api/users/${otherId}`);
                            if (userR.status === 200) {
                                const user = await userR.json() as User;
                                setOtherUser(user);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch chat data", error);
            } finally {
                setLoading(false);
            }
        };

        if (chatId && auth.user) {
            fetchChatData();
        }
    }, [chatId, auth]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        // if (!newMessage.trim() || !auth.user) return;

        // try {
        //     // TODO: Заменить на реальный API endpoint
        //     const r = await fetch(`/api/messages/chat/${chatId}/send`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             text: newMessage.trim(),
        //             senderId: auth.user.uid,
        //         }),
        //     });

        //     if (r.status === 200) {
        //         const message = await r.json();
                // setMessages(prev => [...prev, Message()]);
                // setNewMessage('');
        //     }
        // } catch (error) {
        //     console.error("Failed to send message", error);
        // }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) {
        return (
            <div className={styles.chatWindow}>
                <div className={styles.loading}>Загрузка...</div>
            </div>
        );
    }

    return (
        <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
                <button className={styles.backButton} onClick={onBack}>
                    <IoArrowBack />
                </button>
                {otherUser && (
                    <>
                        <div className={styles.avatar}>
                            <img src={otherUser.avatarUrl} alt={otherUser.name} />
                        </div>
                        <div className={styles.userInfo}>
                            <h3 className={styles.userName}>{otherUser.name}</h3>
                            <p className={styles.userStatus}>В сети</p>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.messagesContainer}>
                {messages.length === 0 ? (
                    <div className={styles.emptyMessages}>
                        <p>Начните переписку</p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.senderId === auth.user?.uid;
                        return (
                            <div
                                key={message.id}
                                className={`${styles.message} ${isOwn ? styles.messageOwn : styles.messageOther}`}
                            >
                                <div className={styles.messageContent}>
                                    <p className={styles.messageText}>{message.text}</p>
                                    <span className={styles.messageTime}>
                                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.messageInputContainer}>
                <textarea
                    className={styles.messageInput}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Напишите сообщение..."
                    rows={1}
                />
                <button
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
}
