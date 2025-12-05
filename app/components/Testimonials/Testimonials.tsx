import styles from './Testimonials.module.css';
import { useTranslations } from 'next-intl';

export default function Testimonials() {
    const t = useTranslations('HomeTestimonials');
    
    const testimonials = [
        { key: 'andrey' },
        { key: 'maxim' },
        { key: 'ksenia' }
    ];
    
    return (
        <section className={styles.section} id="testimonials">
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                
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
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.key} className={styles.testimonial}>
                            <div className={styles.quote}>"</div>
                            <p className={styles.text}>
                                {t(`testimonials.${testimonial.key}.text`)}
                            </p>
                            <div className={styles.author}>
                                <div className={styles.authorAvatar}>
                                    {t(`testimonials.${testimonial.key}.avatar`)}
                                </div>
                                <div className={styles.authorInfo}>
                                    <div className={styles.authorName}>
                                        {t(`testimonials.${testimonial.key}.name`)}
                                    </div>
                                    <div className={styles.authorLocation}>
                                        {t(`testimonials.${testimonial.key}.location`)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
