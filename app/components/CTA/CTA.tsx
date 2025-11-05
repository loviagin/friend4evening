import Link from 'next/link';
import styles from './CTA.module.css';

export default function CTA() {
    return (
        <section className={styles.section} id="cta">
            <div className={styles.container}>
                <h2 className={styles.title}>Готов начать?</h2>
                <p className={styles.subtitle}>
                    Присоединяйся к тысячам пользователей, которые уже нашли компанию для вечера
                </p>
                <div className={styles.buttons}>
                    <Link href="/login" className={styles.buttonPrimary}>
                        Зарегистрироваться
                    </Link>
                    <Link href="/account" className={styles.buttonSecondary}>
                        Войти
                    </Link>
                </div>
            </div>
        </section>
    );
}
