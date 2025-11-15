"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome, AiOutlineMessage, AiOutlineUser } from "react-icons/ai";
import styles from "./MobileMenuBar.module.css";

export default function MobileMenuBar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/account/profile') {
            return pathname === '/account/profile' || pathname.startsWith('/account/profile/');
        }
        return pathname === path || pathname.startsWith(path + '/');
    };

    return (
        <div className={styles.mobileMenuBar}>
            <nav className={styles.nav}>
                <Link 
                    href={'/account/search'} 
                    className={`${styles.link} ${isActive('/account/search') ? styles.active : ''}`}
                >
                    <AiOutlineHome className={styles.icon} />
                    Поиск
                </Link>
                <Link 
                    href={'/account/messages'} 
                    className={`${styles.link} ${isActive('/account/messages') ? styles.active : ''}`}
                >
                    <AiOutlineMessage className={styles.icon} />
                    Сообщения
                </Link>
                <Link 
                    href={'/account/profile'} 
                    className={`${styles.link} ${isActive('/account/profile') ? styles.active : ''}`}
                >
                    <AiOutlineUser className={styles.icon} />
                    Профиль
                </Link>
            </nav>
        </div>
    )
}