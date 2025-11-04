import styles from './Testimonials.module.css';

export default function Testimonials() {
    return (
        <section className={styles.section} id="testimonials">
            <div className={styles.container}>
                <h2 className={styles.title}>Что говорят пользователи</h2>
                <p className={styles.subtitle}>Тысячи довольных пользователей</p>
                
                {/* <div className={styles.stats}>
                    <div className={styles.stat}>
                        <div className={styles.statNumber}>10K+</div>
                        <div className={styles.statLabel}>Активных пользователей</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statNumber}>5K+</div>
                        <div className={styles.statLabel}>Успешных встреч</div>
                    </div>
                    <div className={styles.stat}>
                        <div className={styles.statNumber}>4.8</div>
                        <div className={styles.statLabel}>Средний рейтинг</div>
                    </div>
                </div> */}
                
                <div className={styles.testimonials}>
                    <div className={styles.testimonial}>
                        <div className={styles.quote}>"</div>
                        <p className={styles.text}>
                            Отличный сервис! Нашел компанию на вечер за полчаса. 
                            Всё прошло отлично, обязательно вернусь ещё.
                        </p>
                        <div className={styles.author}>
                            <div className={styles.authorAvatar}>А</div>
                            <div className={styles.authorInfo}>
                                <div className={styles.authorName}>Андрей, 48</div>
                                <div className={styles.authorLocation}>Москва</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.testimonial}>
                        <div className={styles.quote}>"</div>
                        <p className={styles.text}>
                            Удобный поиск и фильтры. Быстро нашёл подходящую компанию. 
                            Сервис действительно работает как надо.
                        </p>
                        <div className={styles.author}>
                            <div className={styles.authorAvatar}>М</div>
                            <div className={styles.authorInfo}>
                                <div className={styles.authorName}>Максим, 28</div>
                                <div className={styles.authorLocation}>Санкт-Петербург</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.testimonial}>
                        <div className={styles.quote}>"</div>
                        <p className={styles.text}>
                            Безопасно и удобно. Система рейтингов помогает выбрать 
                            проверенных людей. Рекомендую!
                        </p>
                        <div className={styles.author}>
                            <div className={styles.authorAvatar}>К</div>
                            <div className={styles.authorInfo}>
                                <div className={styles.authorName}>Ксения, 23</div>
                                <div className={styles.authorLocation}>Казань</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
