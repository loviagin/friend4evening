import { db } from "@/lib/firebase";
import { Review } from "@/models/Review";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    console.log("userId", userId);

    if (!userId) {
        return NextResponse.json({ message: "user Id is required" }, { status: 403 });
    }

    const q = query(collection(db, "reviews"), where("userId", "==", userId));
    const response = await getDocs(q);
    const data = response.docs
    console.log(data)

    if (data.length > 0) {
        let sum = 0;
        const reviews: Review[] = []
        data.forEach((d) => {
            const review = d.data() as Review;
            const time = d.data()['date'] as Timestamp
            review.date = time.toDate();
            reviews.push(review);
            sum += review.rating;
        })

        reviews.sort((a, b) => b.date.getTime() - a.date.getTime());
        const average = sum / reviews.length;

        return NextResponse.json({ reviews, average }, { status: 200 })
    } else {
        return NextResponse.json({ message: "No reviews" }, { status: 404 })
    }
}