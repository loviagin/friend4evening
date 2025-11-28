"use client";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import { useAuth } from "@/app/_providers/AuthProvider";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";

export default function Header() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}><img className={styles.favicon} src={'/icon.png'} /> Friends4Evening</Link>
            <nav className={styles.nav}>
                {(user) ?
                    <>
                        <ul className={styles.navLinks}>
                            <li><Link href="/account/meets" className={`${styles.navLink} ${pathname === '/account/meets' ? styles.active : ''}`}>Встречи</Link></li>
                            <li><Link href="/account/messages" className={`${styles.navLink} ${pathname === '/account/messages' ? styles.active : ''}`}>Сообщения</Link></li>
                            <li><Link href="/account/profile" className={`${styles.navLink} ${pathname === '/account/profile' || pathname?.startsWith('/account/profile/') ? styles.active : ''}`}>Профиль</Link></li>
                        </ul>
                    </>
                    :
                    <>
                        <ul className={styles.navLinks}>
                            <li><Link href="/#how-it-works" className={styles.navLink}>Как это работает</Link></li>
                            <li><Link href="/#features" className={styles.navLink}>Преимущества</Link></li>
                            <li><Link href="/#testimonials" className={styles.navLink}>Отзывы</Link></li>
                        </ul>
                    </>
                }
                <Link href={'/account/profile'} className={styles.accountButton}>
                    {user?.photoURL ? (
                        <div className={styles.avatar}>
                            <Avatar avatarUrl={user.photoURL} />
                        </div>
                    ) : (
                        <svg className={styles.userIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                    <span>{user?.displayName ?? "Аккаунт"}</span>
                </Link>
            </nav>
        </header>
    );
}