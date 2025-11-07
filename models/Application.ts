export type Application = {
    id: string,
    userId: string,
    members: [ApplicationMember],
    blocked: string | null,
}

export type ApplicationMember = {
    id: string,
    userId: string,
    status: ApplicationMemberStatus
}

export enum ApplicationMemberStatus {
    approved, waiting, declined
}