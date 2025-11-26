import { WebPushSubscription } from "@/app/actions"

// models/PushSubscription.ts
export type PushSubscription = {
    createdAt: Date
} & WebPushSubscription