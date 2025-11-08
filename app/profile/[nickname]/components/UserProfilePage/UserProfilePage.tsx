"use client"

import GeneralProfile from "@/app/account/profile/components/GeneralProfile/GeneralProfile";
import { User } from "@/models/User";
import { useEffect, useState } from "react";
import HeroProfile from "@/app/account/profile/components/HeroProfile/HeroProfile";

type Props = {
    nickname: string
}

export default function UserProfilePage({ nickname }: Props) {
    const [user, setUser] = useState<User|null>(null);

    useEffect(() => {
        if (nickname) {
            const fetchUserByNickname = async () => {
                const response = await fetch(`/api/profile/${nickname}`)
                const data = await response.json();
                console.log(data["user"] as User);
                setUser(data["user"] as User);
            }

            fetchUserByNickname()
        }
    }, [nickname])

    return (
        <>
            <HeroProfile user={user} />
            <GeneralProfile user={user} />
        </>
    )
}