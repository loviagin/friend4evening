import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export type ReviewDTO = {
    reviewerId: string,
    userId: string,
    rating: number,
    text: string,
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const review = data as ReviewDTO;

    if (!review) {
        return NextResponse.json({ message: "Not valid Review" }, { status: 403 });
    }
    const ref = doc(collection(db, "reviews"));

    const newReview = {
        id: ref.id,
        reviewerId: review.reviewerId,
        userId: review.userId,
        rating: review.rating,
        text: review.text,
        date: new Date(),
        blocked: false
    }
    console.log(newReview)

    await setDoc(ref, newReview);
    return NextResponse.json({ id: ref.id }, { status: 200 });
}