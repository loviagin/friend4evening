export type User = {
    id: string,
    name: string,
    provider: string,
    email: string | null,
    passwordHash: string | null,
    avatarUrl: string,
    birthday: Date | null,
    registeredDate: Date,
    location: UserLocation | null,
    bio: string | null,
    status: string | null,
    readyToTrip: boolean | null,
    meetIn: [MeetType] | null,
    drinkPreferences: string | null,
    noAlcohol: boolean | null,
    blockedUsers: [string] | null,
    blocked: string | null,
    
}

export enum MeetType {
    currentHome, userHome, online
}

export type UserLocation = {
    country: string,
    city: string,
}