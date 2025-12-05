"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome, AiOutlineMessage, AiOutlineUser } from "react-icons/ai";
import { useTranslations } from 'next-intl';
import styles from "./MobileMenuBar.module.css";

export default function MobileMenuBar() {
    const pathname = usePathname();
    const t = useTranslations('Header');

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
                    href={'/account/meets'} 
                    className={`${styles.link} ${isActive('/account/meets') ? styles.active : ''}`}
                >
                    <AiOutlineHome className={styles.icon} />
                    {t('navLinks.authenticated.meets')}
                </Link>
                <Link 
                    href={'/account/messages'} 
                    className={`${styles.link} ${isActive('/account/messages') ? styles.active : ''}`}
                >
                    <AiOutlineMessage className={styles.icon} />
                    {t('navLinks.authenticated.messages')}
                </Link>
                <Link 
                    href={'/account/profile'} 
                    className={`${styles.link} ${isActive('/account/profile') ? styles.active : ''}`}
                >
                    <AiOutlineUser className={styles.icon} />
                    {t('navLinks.authenticated.profile')}
                </Link>
            </nav>
        </div>
    )
}