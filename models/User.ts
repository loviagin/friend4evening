export type User = {
    id: string,
    name: string,
    provider: string,
    email: string | null,
    nickname: string | null,
    passwordHash: string | null,
    avatarUrl: string,
    birthday: Date | null,
    showBirthday: boolean | null,
    registeredDate: Date,
    location: UserLocation | null,
    bio: string | null,
    status: string | null,
    readyToTrip: boolean | null,
    meetIn: MeetType[] | null,
    drinkPreferences: string[] | null,
    noAlcohol: boolean | null,
    noSmoking: boolean | null,
    blockedUsers: string[] | null,
    blocked: string | null,

}

export enum MeetType {
    currentHome = "CURRENT_HOME",
    userHome = "USER_HOME",
    street = "STREET",
    publicPlaces = "PUBLIC_PLACES",
    parks = "PARKS",
    cafes = "CAFES",
    online = "ONLINE",
}

export const MeetTypeLabels: Record<MeetType, string> = {
    [MeetType.currentHome]: "У себя дома",
    [MeetType.userHome]: "У других дома",
    [MeetType.street]: "На улице",
    [MeetType.publicPlaces]: "В обшественных местах",
    [MeetType.parks]: "В парках",
    [MeetType.cafes]: "В кафе/ресторанах",
    [MeetType.online]: "Онлайн"
}

export type UserLocation = {
    country: string,
    city: string,
}