export type Meet = {
    id: string,
    ownerId: string,
    members: ApplicationMember[],
    location: string | null,
    membersCount: number | null,
    noAlcohol: boolean,
    ageRange: string | null,
    blocked: boolean,
    title: string,
    description: string | null,
    type: string,
    meetType: string | null,
    date: Date,
    duration: string | null,
    status: MeetStatus,
    createdAt: Date,
    notificationDayBeforeSent: boolean
}

export type ApplicationMember = {
    id: string,
    userId: string,
    status: ApplicationMemberStatus
}

export enum ApplicationMemberStatus {
    approved = "approved",
    waiting = "waiting",
    invited = "invited",
    declined = "declined"
}

export enum MeetStatus {
    plan = "plan",
    current = "current",
    completed = "completed",
    canceled = "canceled"
}

export const MeetStatusLabels: Record<MeetStatus, string> = {
    [MeetStatus.plan]: "Запланировано",
    [MeetStatus.current]: "Сейчас идет",
    [MeetStatus.completed]: "Завершена",
    [MeetStatus.canceled]: "Отменена",
}