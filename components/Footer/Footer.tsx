import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer} id="footer">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.column}>
                        <h3 className={styles.logo}>Friends4Evening</h3>
                        <p className={styles.description}>
                            Сервис знакомств для тех, кто хочет провести вечер в хорошей компании.
                        </p>
                        <p className={styles.age}>18+</p>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Навигация</h4>
                        <ul className={styles.links}>
                            <li><Link href="/#hero">Главная</Link></li>
                            <li><Link href="/#how-it-works">Как это работает</Link></li>
                            <li><Link href="/#features">Преимущества</Link></li>
                            <li><Link href="/#screenshots">Скриншоты</Link></li>
                        </ul>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Информация</h4>
                        <ul className={styles.links}>
                            <li><Link href="/#security">Безопасность</Link></li>
                            <li><Link href="/#testimonials">Отзывы</Link></li>
                            <li><Link href="/account">Личный кабинет</Link></li>
                            <li><Link href="/login">Войти</Link></li>
                        </ul>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Контакты</h4>
                        <ul className={styles.links}>
                            <li><Link href="mailto:Friends4Evening@lovigin.com">Поддержка</Link></li>
                            <li><Link href="/agreement">Пользовательское соглашение</Link></li>
                            <li><Link href="/privacy">Политика конфиденциальности</Link></li>
                            <li><Link href="/rules">Правила поведения пользователей</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Friends4Evening. Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    );
}
