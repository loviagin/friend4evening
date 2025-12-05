export type User = {
    id: string,
    name: string,
    provider: string,
    email: string | null,
    nickname: string,
    passwordHash: string | null,
    avatarUrl: string,
    birthday: Date,
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
    privacy: string[],
    tag: string | null,
    blockedUsers: string[] | null,
    blocked: boolean,
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

// MeetTypeLabels has been moved to translations (messages/{locale}.json under "MeetType" namespace)
// Use useTranslations('MeetType') in components to get localized labels
// Example: t('CURRENT_HOME'), t('USER_HOME'), etc.

export type UserLocation = {
    country: string,
    city: string,
}

// tags has been moved to translations (messages/{locale}.json under "UserTags" namespace)
// Use useTranslations('UserTags') in components to get localized labels
// For Dropdown component, create array from translations:
// const t = useTranslations('UserTags');
// const tags = [
//   { key: "READY", label: t('READY') },
//   { key: "CURRENT", label: t('CURRENT') },
//   { key: "BUSY", label: t('BUSY') },
//   { key: "INTENSIVE_SEARCH", label: t('INTENSIVE_SEARCH') }
// ];