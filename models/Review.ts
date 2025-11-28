export type Review = {
    id: string,
    reviewerId: string,
    userId: string,
    rating: number,
    text: string,
    date: Date,
    blocked: boolean
}