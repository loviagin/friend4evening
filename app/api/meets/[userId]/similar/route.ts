import { db } from "@/lib/firebase";
import { Meet } from "@/models/Meet";
import { MeetType, User } from "@/models/User";
import { collection, doc, getDoc, getDocs, or, query, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;

    if (!userId) {
        return NextResponse.json({ message: "User Id is required" }, { status: 403 });
    }

    const d = await getDoc(doc(db, "users", userId));

    if (!d.data()) {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    const data = d.data()!
    const b = data["birthday"] as Timestamp
    data["birthday"] = b.toDate();
    const r = data["dateRegistered"] as Timestamp
    data["dateRegistered"] = r.toDate();
    const user = data as User;
    const age = getAge(user.birthday);

    // query 
    const q = query(collection(db, "meets"), where("status", "==", "plan"), where("type", "==", "open"), where("blocked", "==", false));
    const allMeets = await getDocs(q);
    const readyMeets: Meet[] = []

    for (const m of allMeets.docs) {
        const d1 = m.data();
        d1.date = (d1['date'] as Timestamp).toDate();
        d1.createdAt = (d1['createdAt'] as Timestamp).toDate();

        const meet = d1 as Meet;
        // console.log(user)

        //onwer of meet is in block list
        if (user.blockedUsers && user.blockedUsers !== null && user.blockedUsers.length > 0 && user.blockedUsers.includes(meet.ownerId)) continue;

        // members limit
        if (meet.membersCount && meet.members.filter(f => f.status === "approved").length >= meet.membersCount) continue;

        // already in meet
        if (meet.members.some(f => f.userId === userId)) continue;

        // past date
        if (meet.date < new Date()) continue;

        // AGE filter
        if (meet.ageRange && meet.ageRange !== "none") {
            if (!isAgeInRange(meet.ageRange, age)) continue;
        }

        // CITY filter — ВСЕГДА
        const userCity = user.location?.city?.trim().toLowerCase();
        const meetCity = meet.location?.trim().toLowerCase();

        const isCityMatch = userCity && meetCity && userCity === meetCity;
        const isReadyToTrip = user.readyToTrip === true;

        if (!isCityMatch && !isReadyToTrip) continue;

        // ALCOHOL filter — ВСЕГДА
        if (user.noAlcohol === true) {
            if (meet.noAlcohol !== true) continue;
        }

        // MEET TYPE filter — ВСЕГДА
        if (meet.meetType && meet.meetType !== "none") {
            if (!user.meetIn?.includes(meet.meetType as MeetType)) continue;
        }

        readyMeets.push(meet);
    }

    if (readyMeets.length > 0) {
        return NextResponse.json({ meets: readyMeets }, { status: 200 })
    } else {
        return NextResponse.json({ message: "Not found" }, { status: 404 })
    }
}

function isAgeInRange(range: string, age: number): boolean {
    if (range === "60") {
        return age >= 60;
    }

    const [minStr, maxStr] = range.split("-");
    const min = Number(minStr);
    const max = Number(maxStr);

    return age >= min && age <= max;
}

function getAge(birthday: Date): number {
    const today = new Date();

    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
    }

    return age;
}