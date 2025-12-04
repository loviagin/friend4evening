import { db } from "@/lib/firebase";
import { ApplicationMemberStatus } from "@/models/Meet";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ uid: string, memberId: string }> }) {
    const { uid, memberId } = await params;
    const { action } = await req.json();

    if (!uid || !memberId) {
        return NextResponse.json({ message: "Meet ID and Member ID are required" }, { status: 400 });
    }

    if (!action || !['approve', 'decline', 'remove'].includes(action)) {
        return NextResponse.json({ message: "Valid action is required (approve, decline, remove)" }, { status: 400 });
    }

    try {
        const meetDoc = await getDoc(doc(db, "meets", uid));
        if (!meetDoc.exists()) {
            return NextResponse.json({ message: "Meet not found" }, { status: 404 });
        }

        const meetData = meetDoc.data();
        const members = meetData.members || [];
        const memberIds = meetData.memberIds || [];

        let updatedMembers;
        let updatedMemberIds = memberIds;

        if (action === 'remove') {
            // Находим userId участника перед удалением
            const memberToRemove = members.find((m: any) => m.id === memberId);
            const userIdToRemove = memberToRemove?.userId;
            
            // Удаляем участника из массива
            updatedMembers = members.filter((m: any) => m.id !== memberId);
            
            // Удаляем userId из memberIds, если он там есть
            if (userIdToRemove) {
                updatedMemberIds = memberIds.filter((id: string) => id !== userIdToRemove);
            }
        } else {
            // Обновляем статус участника
            updatedMembers = members.map((m: any) => {
                if (m.id === memberId) {
                    return {
                        ...m,
                        status: action === 'approve' ? ApplicationMemberStatus.approved : ApplicationMemberStatus.declined
                    };
                }
                return m;
            });
        }

        await updateDoc(doc(db, "meets", uid), {
            members: updatedMembers,
            memberIds: updatedMemberIds
        });

        return NextResponse.json({ message: "Member status updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating member status:", error);
        return NextResponse.json({ message: "Error updating member status" }, { status: 500 });
    }
}
