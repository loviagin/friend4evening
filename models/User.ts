export type User = {
    id: string,
    name: string,
    provider: string,
    email: string | null,
    nickname: string,
    passwordHash: string | null,
    avatarUrl: string,
    birthday: Date | null,
    showBirthday: boolean | null,
    dateRegistered: Date,
    location: UserLocation | null,
    bio: string | null,
    status: Record<string, Date>,
    readyToTrip: boolean | null,
    meetIn: MeetType[] | null,
    drinkPreferences: string[] | null,
    noAlcohol: boolean | null,
    noSmoking: boolean | null,
    friends: string[],
    tag: string | null,
    blockedUsers: string[] | null,
    blocked: string | null,
    tags: string[],
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
    [MeetType.publicPlaces]: "В общественных местах",
    [MeetType.parks]: "В парках",
    [MeetType.cafes]: "В кафе/ресторанах",
    [MeetType.online]: "Онлайн"
}

export type UserLocation = {
    country: string,
    city: string,
}