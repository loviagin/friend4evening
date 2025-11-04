"use client";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
    const router = useRouter();

    const handleAccountClick = () => {
        router.push('/login')
    }
    
    return (
        <header className={styles.header}>
            <a href="/" className={styles.logo}>Friend4Evening</a>
            <nav className={styles.nav}>
                <ul className={styles.navLinks}>
                    <li><a href="#how-it-works" className={styles.navLink}>Как это работает</a></li>
                    <li><a href="#features" className={styles.navLink}>Преимущества</a></li>
                    <li><a href="#testimonials" className={styles.navLink}>Отзывы</a></li>
                </ul>
                <button onClick={handleAccountClick} className={styles.accountButton}>Аккаунт</button>
            </nav>
        </header>
    );
}