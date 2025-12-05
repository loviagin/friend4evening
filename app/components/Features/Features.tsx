import styles from './Features.module.css';
import { useTranslations } from 'next-intl';

export default function Features() {
    const t = useTranslations('HomeFeatures');
    
    const features = [
        { key: 'security', icon: '🔒' },
        { key: 'fast', icon: '⚡' },
        { key: 'byInterests', icon: '🎯' },
        { key: 'chat', icon: '💬' },
        { key: 'nearby', icon: '📍' },
        { key: 'reviews', icon: '⭐' }
    ];
    
    return (
        <section className={styles.section} id="features">
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                
                <div className={styles.featuresGrid}>
                    {features.map((feature) => (
                        <div key={feature.key} className={styles.feature}>
                            <div className={styles.icon}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>
                                {t(`features.${feature.key}.title`)}
                            </h3>
                            <p className={styles.featureDescription}>
                                {t(`features.${feature.key}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
