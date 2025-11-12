import styles from './BlockedProfile.module.css'

export default function BlockedProfile() {
    return (
        <section className={styles.section}>
            <div className={styles.blockedContainer}>
                <span className={styles.icon}>🚫</span>
                <h1 className={styles.title}>Аккаунт заблокирован</h1>
                <div className={styles.message}>
                    Аккаунт был заблокирован Администрацией сервиса Friends4Evening.
                    <br />
                    Если вы думаете, что произошла ошибка, пожалуйста напишите нам на{' '}
                    <a href="mailto:friends4evening@lovigin.com">friends4evening@lovigin.com</a>
                </div>
                <div className={styles.warningBox}>
                    <p className={styles.warningText}>
                        ⚠️ Блокировка может быть применена за нарушение правил сервиса, 
                        неподобающее поведение или другие действия, противоречащие 
                        пользовательскому соглашению.
                    </p>
                </div>
            </div>
        </section>
    )
}