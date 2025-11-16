import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

function generateNickname(): string {
    const part1 = [
        "rapid", "silver", "dark", "bright", "cool", "happy", "wild", "magic",
        "iron", "fire", "storm", "shadow", "neon", "pixel", "frozen"
    ];

    const part2 = [
        "Fox", "Wolf", "Tiger", "Eagle", "Dragon", "Bear", "Lion", "Falcon",
        "Panther", "Raven", "Hawk", "Shark", "Wizard", "Knight"
    ];

    const numbers = Math.floor(Math.random() * 999); // 0–998

    const w1 = part1[Math.floor(Math.random() * part1.length)];
    const w2 = part2[Math.floor(Math.random() * part2.length)];

    return `${w1}${w2}${numbers}`;
}

const isNicknameAvailable = async (nickname: string) => {
    const q = query(collection(db, "users"), where("nickname", "==", nickname));
    const data = await getDocs(q);
    if (data.docs.length > 0) {
        return false
    }

    return true
}

export async function POST(req: NextRequest) {
    const { id, email, name, avatarUrl, provider, passwordHash, birthday } = await req.json();

    console.log("email", email);
    if (!email || !id) {
        return NextResponse.json({ message: "Email & id is required" }, { status: 400 })
    }

    const document = await getDoc(doc(db, "users", id));

    if (document.exists()) { //user in database
        return NextResponse.json({ userId: document.data()["id"] }, { status: 202 })
    } else { //user not in database
        let nickname: string | null = generateNickname();
        let nicknameAvailable = await isNicknameAvailable(nickname);

        if (nicknameAvailable === false) {
            nickname = generateNickname()
            nicknameAvailable = await isNicknameAvailable(nickname);

            if (nicknameAvailable === false) {
                nickname = generateNickname()
                nicknameAvailable = await isNicknameAvailable(nickname);

                if (nicknameAvailable === false) {
                    nickname = generateNickname()
                    nicknameAvailable = await isNicknameAvailable(nickname);

                    if (nicknameAvailable === false) {
                        nickname = null;
                    }
                }
            }
        }

        const status: Record<string, Date> = { "online": new Date() }

        const newUser = {
            id,
            name: name ?? "",
            email,
            nickname,
            passwordHash,
            provider: provider ?? "not_provided",
            status,
            avatarUrl: avatarUrl ?? "avatar1",
            birthday: birthday ? Timestamp.fromDate(new Date(birthday)) : Timestamp.fromDate(new Date()),
            dateRegistered: Timestamp.fromDate(new Date()),
            tags: ["user"],
        };

        await setDoc(doc(db, "users", newUser.id), newUser);
        return NextResponse.json({ message: "No user" }, { status: 400 });
    }
}