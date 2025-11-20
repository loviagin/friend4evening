import { db } from "@/lib/firebase";
import { User } from "@/models/User";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    const d = await getDocs(collection(db, "users"));

    const cities: string[] = []
    
    d.docs.flatMap((u) => {
        const user = u.data() as User;
        if (user.location?.city && user.location.city.length > 0 && !cities.includes(user.location.city)) {
            cities.push(user.location.city)
        }
    })

    if (cities.length > 0) {
        return NextResponse.json({ cities: cities }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}