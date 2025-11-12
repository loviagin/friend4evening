"use client";

import { useAuth } from "@/app/_providers/AuthProvider";
import { User } from "@/models/User";
import { useEffect, useState } from "react";
import styles from './page.module.css'

export default function FriendsPage() {
    const auth = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [friends, setFriends] = useState<User[]>([]);

    useEffect(() => {
        const fetchUser = async (id: string) => {
            const resp = await fetch(`/api/users/${id}`);
            const data = await resp.json();

            if (resp.status === 200) {
                const u = data as User
                setUser(u)

                if (u?.friends && u.friends.length !== 0) {
                    setFriends([])
                    fetchFriends(u.friends)
                }
            }
        }

        const fetchFriends = (ids: string[]) => {
            console.log(ids)

            ids.forEach(async (i) => {
                const r = await fetch(`/api/users/${i}`)
                const d = await r.json()

                if (r.status === 200) {
                    const user1 = d as User
                    if (!friends.includes(user1)) {
                        setFriends((prev) => ([...prev, user1]))
                    }
                }
            });
        }

        if (auth.user) {
            fetchUser(auth.user.uid);
        }
    }, [auth])

    return (
        <main className={styles.container}>
            {friends.map((friend) => (
                <div key={friend.id}>
                    {friend.name}
                </div>
            ))}
            {friends.length}
        </main>
    )
}