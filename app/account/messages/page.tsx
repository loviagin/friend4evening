"use client"

import { useAuth } from "@/app/_providers/AuthProvider"
import LoadingView from "@/components/LoadingView/LoadingView";
import { Chat } from "@/models/Chat";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './page.module.css'
import ChatList from "./components/ChatList/ChatList";
import ChatWindow from "./components/ChatWindow/ChatWindow";

export default function AccountMessages() {
    const auth = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Извлекаем id чата из query параметра ?chat=
    useEffect(() => {
        const chatId = searchParams.get('chat');
        if (chatId) {
            setSelectedChatId(chatId);
        } else {
            setSelectedChatId(null);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchChats = async (userId: string) => {
            try {
                // TODO: Заменить на реальный API endpoint
                const r = await fetch(`/api/messages/${userId}/chats`);
                
                if (r.status === 200) {
                    const data = await r.json();
                    const chatsData = (data.chats || data) as Chat[];
                    setChats(chatsData);
                }
            } catch (error) {
                console.error("Failed to fetch chats", error);
            } finally {
                setLoading(false);
            }
        }

        if (auth.user) {
            fetchChats(auth.user.uid);
        }
    }, [auth]);

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
        router.push(`/account/messages?chat=${chatId}`);
    };

    const handleBackToList = () => {
        setSelectedChatId(null);
        router.push('/account/messages');
    };

    if (loading) {
        return <LoadingView />;
    }

    return (
        <main className={styles.container}>
            <div className={styles.chatsLayout}>
                <div className={`${styles.chatListContainer} ${selectedChatId ? styles.chatListHidden : ''}`}>
                    <p>Здесь будут ваши встречи</p>
                    <ChatList 
                        chats={chats} 
                        selectedChatId={selectedChatId}
                        onChatSelect={handleChatSelect}
                    />
                </div>
                <div className={`${styles.chatWindowContainer} ${selectedChatId ? styles.chatWindowVisible : ''}`}>
                    {selectedChatId ? (
                        <ChatWindow 
                            chatId={selectedChatId}
                            onBack={handleBackToList}
                        />
                    ) : (
                        <div className={styles.emptyChatState}>
                            <p>Выберите чат для начала переписки</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
