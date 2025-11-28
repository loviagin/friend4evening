export type Chat = {
    id: string;
    participants: string[]; // userIds
    lastMessage?: Message;
    lastMessageAt?: Date;
    createdAt: Date;
    unreadCount?: number;
}

export type Message = {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    createdAt: Date;
    readAt?: Date | null;
}
