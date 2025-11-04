"use client";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import styles from "./layout.module.css";

export type User = {
    id: string,
    email: string | null,
    name: string | null,
    lastName: string | null,
}

export default function AccountLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | undefined>();

    useEffect(() => {
        console.log("useEffect.Home.WithAuth")
        onAuthStateChanged(auth, (user) => {
            console.log("onAuthStateChanged")
            if (user) {
                setUser({
                    id: user.uid,
                    email: user.email,
                    name: null,
                    lastName: null,
                })

                setLoading(false);
            } else {
                router.push('/login');
            }
        })
    }, [auth])

    if (loading) {
        return (
            <div className={styles.loader}>
                <div className={styles.container}>
                    <div className={styles.spinner}></div>
                    <div>
                        <div className={styles.text}>Загрузка</div>
                        <div className={styles.dots}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
             children 
        );
    }
}