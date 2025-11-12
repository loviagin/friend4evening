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

export const FriendStatusLabel: Record<FriendStatus, string> = {
    [FriendStatus.waiting]: "Ожидает",
    [FriendStatus.approved]: "Друг",
    [FriendStatus.declined]: "Отклонен"

}