import Link from 'next/link';
import styles from './Screenshots.module.css';

export default function Screenshots() {
    return (
        <section className={styles.section} id="screenshots">
            <div className={styles.container}>
                <h2 className={styles.title}>Как это выглядит</h2>
                <p className={styles.subtitle}>Интуитивно понятный интерфейс</p>
                
                <div className={styles.screenshotsGrid}>
                    <div className={styles.screenshot}>
                        <div className={styles.placeholder}>
                            <span className={styles.placeholderText}>Скриншот профиля</span>
                        </div>
                        <p className={styles.caption}>Профиль пользователя</p>
                    </div>
                    
                    <div className={styles.screenshot}>
                        <div className={styles.placeholder}>
                            <span className={styles.placeholderText}>Скриншот поиска</span>
                        </div>
                        <p className={styles.caption}>Поиск и фильтры</p>
                    </div>
                    
                    <div className={styles.screenshot}>
                        <div className={styles.placeholder}>
                            <span className={styles.placeholderText}>Скриншот чата</span>
                        </div>
                        <p className={styles.caption}>Мессенджер</p>
                    </div>
                </div>
                
                <div className={styles.cta}>
                    <Link href="/account" className={styles.button}>Попробовать сейчас</Link>
                </div>
            </div>
        </section>
    );
}
