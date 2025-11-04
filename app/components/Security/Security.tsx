import styles from './Security.module.css';

export default function Security() {
    return (
        <section className={styles.section} id="security">
            <div className={styles.container}>
                <h2 className={styles.title}>Безопасность превыше всего</h2>
                <p className={styles.subtitle}>Мы заботимся о твоей безопасности</p>
                
                <div className={styles.securityGrid}>
                    <div className={styles.securityItem}>
                        <div className={styles.icon}>🛡️</div>
                        <h3 className={styles.itemTitle}>Верификация</h3>
                        <p className={styles.itemDescription}>
                            Проверка профилей и модерация контента. 
                            Мы работаем только с совершеннолетними пользователями.
                        </p>
                    </div>
                    
                    <div className={styles.securityItem}>
                        <div className={styles.icon}>🔐</div>
                        <h3 className={styles.itemTitle}>Защита данных</h3>
                        <p className={styles.itemDescription}>
                            Твои личные данные надёжно защищены. 
                            Мы используем современные методы шифрования.
                        </p>
                    </div>
                    
                    <div className={styles.securityItem}>
                        <div className={styles.icon}>🚨</div>
                        <h3 className={styles.itemTitle}>Система жалоб</h3>
                        <p className={styles.itemDescription}>
                            Быстрая система реагирования на жалобы. 
                            Нарушители блокируются моментально.
                        </p>
                    </div>
                    
                    <div className={styles.securityItem}>
                        <div className={styles.icon}>✅</div>
                        <h3 className={styles.itemTitle}>Рейтинги</h3>
                        <p className={styles.itemDescription}>
                            Система отзывов и рейтингов помогает 
                            выбрать проверенных пользователей.
                        </p>
                    </div>
                </div>
                
                <div className={styles.note}>
                    <p className={styles.noteText}>
                        ⚠️ Помни: всегда встречайся в публичных местах и сообщай друзьям о своих планах.
                    </p>
                </div>
            </div>
        </section>
    );
}
