export type Meets = {
    id: string,
    ownerId: string,
    members: string[],
    date: Date,
    status: MeetsType,
    createdAt: Date
}

export enum MeetsType {
    plan = "PLAN",
    current = "CURRENT",
    completed = "COMPLETED",
    canceled = "CANCELED"
}

export const MeetsTypeLabels: Record<MeetsType, string> = {
    [MeetsType.plan]: "Запланировано",
    [MeetsType.current]: "Сейчас идет",
    [MeetsType.completed]: "Завершена",
    [MeetsType.canceled]: "Отменена",
}