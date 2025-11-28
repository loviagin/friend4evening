export type Notification = {
    id: string,
    senderId: string,
    type: string,
    title: string,
    description: string,
    url: string,
    createdAt: Date,
    readAt: Date | null
}