import styles from './Security.module.css';
import { useTranslations } from 'next-intl';

export default function Security() {
    const t = useTranslations('HomeSecurity');
    
    const items = [
        { key: 'verification' },
        { key: 'dataProtection' },
        { key: 'complaints' },
        { key: 'ratings' }
    ];
    
    return (
        <section className={styles.section} id="security">
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                
                <div className={styles.securityGrid}>
                    {items.map((item) => (
                        <div key={item.key} className={styles.securityItem}>
                            <div className={styles.icon}>{t(`items.${item.key}.icon`)}</div>
                            <h3 className={styles.itemTitle}>
                                {t(`items.${item.key}.title`)}
                            </h3>
                            <p className={styles.itemDescription}>
                                {t(`items.${item.key}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className={styles.note}>
                    <p className={styles.noteText}>
                        {t('note')}
                    </p>
                </div>
            </div>
        </section>
    );
}
