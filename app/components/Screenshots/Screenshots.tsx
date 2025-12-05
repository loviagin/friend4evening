import Link from 'next/link';
import styles from './Screenshots.module.css';
import { useTranslations } from 'next-intl';

export default function Screenshots() {
    const t = useTranslations('HomeScreenshots');
    
    const screenshots = [
        { key: 'profile' },
        { key: 'search' },
        { key: 'messenger' }
    ];
    
    return (
        <section className={styles.section} id="screenshots">
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                
                <div className={styles.screenshotsGrid}>
                    {screenshots.map((screenshot) => {
                        const image = t(`screenshots.${screenshot.key}.image`);
                        const alt = t(`screenshots.${screenshot.key}.alt`);
                        const caption = t(`screenshots.${screenshot.key}.caption`);
                        
                        return (
                            <div key={screenshot.key} className={styles.screenshot}>
                                <div className={styles.placeholder}>
                                    {image && (
                                        <img src={image} alt={alt} />
                                    )}
                                </div>
                                <p className={styles.caption}>{caption}</p>
                            </div>
                        );
                    })}
                </div>
                
                <div className={styles.cta}>
                    <Link href="/account" className={styles.button}>{t('button')}</Link>
                </div>
            </div>
        </section>
    );
}
