export type Friend = {
    id: string,
    senderId: string,
    receiverId: string,
    status: FriendStatus,
    date: Date
}

export enum FriendStatus {
    waiting = "WAITING",
    approved = "APPROVED",
    declined = "DECLINED"
}

// FriendStatusLabel has been moved to translations (messages/{locale}.json under "FriendStatus" namespace)
// Use useTranslations('FriendStatus') in components to get localized labels