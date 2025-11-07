import { EditForm } from "@/app/account/profile/components/EditProfile/EditProfile";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

/* export async function GET(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    */

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const form = await req.json()
    const data = form as EditForm

    console.log(data)
    if (!uid) {
        return NextResponse.json({ message: "Id is required" }, { status: 500 })
    }

    await updateDoc(doc(db, "users", uid), {
        avatarUrl: data.avatarUrl,
        name: data.name,
        nickname: data.nickname,
        birthday: data.birthday,
        showBirthday: data.showBirthday,
        bio: data.bio,
        location: data.location,
        readyToTrip: data.readyToTrip,
        meetIn: data.meetIn,
        drinkPreferences: data.drinkPreferences,
        noAlcohol: data.noAlcohol,
        noSmoking: data.noSmoking
    })

    return NextResponse.json({ userId: uid }, { status: 200 })
}