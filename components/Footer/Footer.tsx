import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer} id="footer">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.column}>
                        <h3 className={styles.logo}>Friend4Evening</h3>
                        <p className={styles.description}>
                            Сервис знакомств для тех, кто хочет провести вечер в хорошей компании.
                        </p>
                        <p className={styles.age}>18+</p>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Навигация</h4>
                        <ul className={styles.links}>
                            <li><a href="#hero">Главная</a></li>
                            <li><a href="#how-it-works">Как это работает</a></li>
                            <li><a href="#features">Преимущества</a></li>
                            <li><a href="#screenshots">Скриншоты</a></li>
                        </ul>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Информация</h4>
                        <ul className={styles.links}>
                            <li><a href="#security">Безопасность</a></li>
                            <li><a href="#testimonials">Отзывы</a></li>
                            <li><a href="/account">Личный кабинет</a></li>
                            <li><a href="/login">Войти</a></li>
                        </ul>
                    </div>
                    
                    <div className={styles.column}>
                        <h4 className={styles.columnTitle}>Контакты</h4>
                        <ul className={styles.links}>
                            <li><a href="mailto:friend4evening@lovigin.com">Поддержка</a></li>
                            <li><a href="/agreement">Пользовательское соглашение</a></li>
                            <li><a href="/privacy">Политика конфиденциальности</a></li>
                            <li><a href="/rules">Правила поведения пользователей</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Friend4Evening. Все права защищены.
                    </p>
                </div>
            </div>
        </footer>
    );
}
