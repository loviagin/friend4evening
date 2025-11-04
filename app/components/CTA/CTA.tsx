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
                    <a href="/login" className={styles.buttonPrimary}>
                        Зарегистрироваться
                    </a>
                    <a href="/account" className={styles.buttonSecondary}>
                        Войти
                    </a>
                </div>
            </div>
        </section>
    );
}
