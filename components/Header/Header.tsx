"use client";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import { onAuthStateChanged } from "firebase/auth";

type User = {
    name: string | null,
    avatarUrl: string | null,
}

export default function Header() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    name: user.displayName,
                    avatarUrl: user.photoURL
                })
            } else {
                setUser({
                    name: null,
                    avatarUrl: null
                })
            }
        })
    }, [auth]);

    const handleAccountClick = () => {
        router.push('/account')
    }

    return (
        <header className={styles.header}>
            <a href="/" className={styles.logo}><img className={styles.favicon} src={'icon.png'} /> Friend4Evening</a>
            <nav className={styles.nav}>
                {(user) ?
                    <>
                        <ul className={styles.navLinks}>
                            <li><a href="#how-it-works" className={styles.navLink}>Поиск</a></li>
                            <li><a href="#features" className={styles.navLink}>Сообщения</a></li>
                            <li><a href="#testimonials" className={styles.navLink}>Профиль</a></li>
                        </ul>
                    </>
                    :
                    <>
                        <ul className={styles.navLinks}>
                            <li><a href="/#how-it-works" className={styles.navLink}>Как это работает</a></li>
                            <li><a href="/#features" className={styles.navLink}>Преимущества</a></li>
                            <li><a href="/#testimonials" className={styles.navLink}>Отзывы</a></li>
                        </ul>
                    </>
                }
                <button onClick={handleAccountClick} className={styles.accountButton}>
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name || "User"} className={styles.avatar} />
                    ) : (
                        <svg className={styles.userIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                    <span>{user?.name ?? "Аккаунт"}</span>
                </button>
            </nav>
        </header>
    );
}