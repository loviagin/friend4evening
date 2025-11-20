import { MeetType, UserLocation } from "./User"

export type Application = {
    id: string,
    ownerId: string,
    members: ApplicationMember[],
    status: ApplicationStatus,
    location: UserLocation | null,
    membersCount: number | null,
    noAlcohol: boolean,
    ageRange: string | null,
    blocked: string | null,
    title: string | null,
    description: string | null,
    meetType: MeetType,
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
    approved, waiting, declined
}

export enum ApplicationStatus {
    open, closed, canceled
}