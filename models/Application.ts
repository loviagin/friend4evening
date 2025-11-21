import { UserLocation } from "./User"

export type Application = {
    id: string,
    ownerId: string,
    members: ApplicationMember[],
    status: ApplicationStatus,
    location: string | null,
    membersCount: number | null,
    noAlcohol: boolean,
    ageRange: string | null,
    blocked: string | null,
    title: string,
    description: string | null,
    meetType: string | null,
    date: Date,
    duration: string | null,
    createdAt: Date
}

export type ApplicationMember = {
    id: string,
    userId: string,
    status: ApplicationMemberStatus
}

export enum ApplicationMemberStatus {
    approved = "approved",
    waiting = "waiting",
    declined = "declined"
}

export enum ApplicationStatus {
    open = "open",
    closed = "closed",
    canceled = "canceled"
}

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
    [ApplicationStatus.open]: "Открыта",
    [ApplicationStatus.closed]: "Закрыта",
    [ApplicationStatus.canceled]: "Отменена"
}