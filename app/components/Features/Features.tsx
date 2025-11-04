import styles from './Features.module.css';

export default function Features() {
    return (
        <section className={styles.section} id="features">
            <div className={styles.container}>
                <h2 className={styles.title}>Почему выбирают нас</h2>
                <p className={styles.subtitle}>Всё для комфортного и безопасного общения</p>
                
                <div className={styles.featuresGrid}>
                    <div className={styles.feature}>
                        <div className={styles.icon}>🔒</div>
                        <h3 className={styles.featureTitle}>Безопасность</h3>
                        <p className={styles.featureDescription}>
                            Проверенные профили и система модерации. 
                            Твоя безопасность - наш приоритет.
                        </p>
                    </div>
                    
                    <div className={styles.feature}>
                        <div className={styles.icon}>⚡</div>
                        <h3 className={styles.featureTitle}>Быстро</h3>
                        <p className={styles.featureDescription}>
                            Найди компанию за несколько минут. 
                            Никаких долгих анкет и ожиданий.
                        </p>
                    </div>
                    
                    <div className={styles.feature}>
                        <div className={styles.icon}>🎯</div>
                        <h3 className={styles.featureTitle}>По интересам</h3>
                        <p className={styles.featureDescription}>
                            Фильтры по возрасту, интересам и локации. 
                            Найди именно того, кто тебе нужен.
                        </p>
                    </div>
                    
                    <div className={styles.feature}>
                        <div className={styles.icon}>💬</div>
                        <h3 className={styles.featureTitle}>Удобный чат</h3>
                        <p className={styles.featureDescription}>
                            Встроенный мессенджер для общения. 
                            Обсудите планы и договоритесь о встрече.
                        </p>
                    </div>
                    
                    <div className={styles.feature}>
                        <div className={styles.icon}>📍</div>
                        <h3 className={styles.featureTitle}>Рядом</h3>
                        <p className={styles.featureDescription}>
                            Ищи компанию в своём городе или районе. 
                            Встречайтесь там, где удобно вам обоим.
                        </p>
                    </div>
                    
                    <div className={styles.feature}>
                        <div className={styles.icon}>⭐</div>
                        <h3 className={styles.featureTitle}>Отзывы</h3>
                        <p className={styles.featureDescription}>
                            Система рейтингов и отзывов. 
                            Выбирай проверенных пользователей.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
