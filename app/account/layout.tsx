"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./layout.module.css";
import { useAuth } from "../_providers/AuthProvider";

export default function AccountLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) router.replace("/login");
    }, [loading, user, router])

    if ((loading && loading === true) || user === null || user === undefined) {
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
    }

    return (
        children
    );
}