"use client"
import { useEffect, useState } from "react"
import styles from "./AdminProfile.module.css"
import { useAuth } from "@/app/_providers/AuthProvider"
import { User } from "@/models/User";
import Link from "next/link";

export default function AdminProfile() {
    const auth = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const base = process.env.NEXT_PUBLIC_URL!;

    useEffect(() => {
        const fetchUsers = async (id: string) => {
            const resp = await fetch(`/api/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ adminId: id })
            })
            const data = await resp.json();

            if (resp.status === 200) {
                setUsers(data["users"] as User[])
            } else {
                setUsers([])
            }

            console.log(users)
        }

        if (auth.user) {
            fetchUsers(auth.user.uid)
        }
    }, [auth])

    const handleBlock = async (userId: string) => {
        const resp = await fetch("/api/users/block", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ adminId: auth.user?.uid, userId })
        })
        const data = await resp.json()

        if (resp.status === 200) {
            const us1 = users.filter((u) => u.id === userId);
            us1[0].blocked = true
            setUsers((prev) => ([...prev.map((us) => us.id === userId ? us1[0] : us)]))
        }
    }

    const handleUnblock = async (userId: string) => {
        const resp = await fetch("/api/users/unblock", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ adminId: auth.user?.uid, userId })
        })
        const data = await resp.json()

        if (resp.status === 200) {
            const us1 = users.filter((u) => u.id === userId);
            us1[0].blocked = false
            setUsers((prev) => ([...prev.map((us) => us.id === userId ? us1[0] : us)]))
        }
    }

    return (
        <section className={styles.section}>
            {users.length === 0 ? (
                <div className={styles.emptyState}>
                    Пользователи не найдены
                </div>
            ) : (
                users.map((user) => (
                    <div key={user.id} className={styles.userCard}>
                        <div className={styles.userHeader}>
                            {user.nickname ? (
                                <Link
                                    href={`/profile/${user.nickname}`}
                                    target="_blank"
                                    className={styles.userName}
                                >
                                    {user.name || "Имя не указано"}
                                </Link>
                            ) : (
                                <>{user.name || "Имя не указано"}</>
                            )}
                            {user?.tags && user.tags.includes("verified") && (
                                <img src={'/verified.webp'} className={styles.verifiedBadge} alt="Verified" />
                            )}

                            {user.tags && user.tags.includes("admin") && (
                                <span className={styles.adminBadge}>👑 Admin</span>
                            )}
                        </div>

                        {user.nickname && (
                            <p className={styles.nickname}>@{user.nickname}</p>
                        )}

                        <div className={styles.userActions}>
                            {user.blocked === true ? (
                                <button
                                    className={styles.buttonUnblock}
                                    onClick={() => handleUnblock(user.id)}
                                >
                                    🔓 Разблокировать
                                </button>
                            ) : (
                                <button
                                    className={styles.buttonBlock}
                                    onClick={() => handleBlock(user.id)}
                                >
                                    🚫 Заблокировать
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </section>
    )
}