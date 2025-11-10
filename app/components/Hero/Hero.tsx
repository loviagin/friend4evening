import Link from 'next/link';
import styles from './Hero.module.css';

export default function HomeHero() {
    return (
        <section className={styles.hero} id="hero">
            <div className={styles.content}>
                <h1 className={styles.title}>Friends4Evening</h1>
                <p className={styles.subtitle}>Найди компанию для вечера</p>
                <p className={styles.description}>
                    Сервис знакомств для тех, кто хочет провести вечер в хорошей компании. 
                    Быстро, безопасно и по интересам.
                </p>
                <div className={styles.ctaButtons}>
                    <Link href="/account" className={`${styles.button} ${styles.buttonPrimary}`}>
                        Начать поиск
                    </Link>
                    <Link href="#how-it-works" className={`${styles.button} ${styles.buttonSecondary}`}>
                        Узнать больше
                    </Link>
                </div>
            </div>
        </section>
    );
}