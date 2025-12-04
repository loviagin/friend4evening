import { db } from "@/lib/firebase";
import { ApplicationMemberStatus } from "@/models/Meet";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    const { userId } = await req.json();

    if (!uid || !userId) {
        return NextResponse.json({ message: "Meet ID and User ID are required" }, { status: 400 });
    }

    try {
        const meetDoc = await getDoc(doc(db, "meets", uid));
        if (!meetDoc.exists()) {
            return NextResponse.json({ message: "Meet not found" }, { status: 404 });
        }

        const meetData = meetDoc.data();
        const members = meetData.members || [];
        const memberIds = meetData.memberIds || [];

        // Проверяем, является ли пользователь уже участником
        const existingMember = members.find((m: any) => m.userId === userId);
        
        let updatedMembers;
        let updatedMemberIds = memberIds.includes(userId) ? memberIds : [...memberIds, userId];

        if (existingMember) {
            // Если пользователь уже участник
            if (existingMember.status === ApplicationMemberStatus.invited) {
                // Если статус 'invited', меняем на 'approved'
                updatedMembers = members.map((m: any) => {
                    if (m.userId === userId) {
                        return {
                            ...m,
                            status: ApplicationMemberStatus.approved
                        };
                    }
                    return m;
                });
            } else {
                // Если статус другой (approved, waiting, declined), возвращаем ошибку
                return NextResponse.json({ message: "User is already a member" }, { status: 400 });
            }
        } else {
            // Добавляем пользователя в members со статусом waiting
            const newMember = {
                id: randomUUID(),
                userId: userId,
                status: ApplicationMemberStatus.waiting
            };

            updatedMembers = [...members, newMember];
            if (!memberIds.includes(userId)) {
                updatedMemberIds = [...memberIds, userId];
            }
        }

        await updateDoc(doc(db, "meets", uid), {
            members: updatedMembers,
            memberIds: updatedMemberIds
        });

        return NextResponse.json({ message: "Successfully joined the meet" }, { status: 200 });
    } catch (error) {
        console.error("Error joining meet:", error);
        return NextResponse.json({ message: "Error joining meet" }, { status: 500 });
    }
}
