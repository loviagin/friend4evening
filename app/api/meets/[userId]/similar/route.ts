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

    /**
     * birthday
     * location: string | null;
    readyToTrip: boolean | null;
    meetIn: MeetType[] | null;
    noAlcohol: boolean | null;
     */

    const data = d.data()!
    const b = data["birthday"] as Timestamp
    data["birthday"] = b.toDate();
    const r = data["dateRegistered"] as Timestamp
    data["dateRegistered"] = r.toDate();
    const user = data as User;
    const age = getAge(user.birthday);

    // query 
    const q = query(collection(db, "meets"), where("status", "==", "plan"))
    const allMeets = await getDocs(q);
    const readyMeets: Meet[] = []

    for (const m of allMeets.docs) { 
        const d1 = m.data();

        const time = d1['date'] as Timestamp
        const created = d1['createdAt'] as Timestamp
        d1.date = time.toDate()
        d1.createdAt = created.toDate();

        const meet = d1 as Meet

        if (meet.membersCount && meet.members.filter((f1) => f1.status === "approved").length >= meet.membersCount) continue;
        
        if (meet.members.filter((f) => f.userId === userId).length > 0) continue;

        if (meet.ageRange && meet.ageRange !== null && meet.ageRange !== "none") {
            if (isAgeInRange(meet.ageRange, age)) {
                if ((meet.location && meet.location !== null && meet.location.length > 0) &&
                    (user.location && user.location.city != null && user.location.city.length > 0)) {
                    if ((user.location.city.toLowerCase().includes(meet.location.toLowerCase())) ||
                        (user.readyToTrip && user.readyToTrip !== null && user.readyToTrip === true)) {
                        if ((user.noAlcohol && meet.noAlcohol === user.noAlcohol) ||
                            (!user.noAlcohol || user.noAlcohol === null)) {
                            if (meet.meetType && meet.meetType !== "none" && user.meetIn && user.meetIn !== null) {
                                if (user.meetIn.includes(meet.meetType as MeetType)) {
                                    readyMeets.push(meet);
                                } else {
                                    continue
                                }
                            }
                        } else {
                            continue
                        }
                    } else {
                        continue
                    }
                }
            } else {
                continue
            }
        }

        readyMeets.push(meet)
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