import Link from 'next/link';
import styles from './HowItWorks.module.css';
import { useTranslations } from 'next-intl';

export default function HowItWorks() {
    const t = useTranslations('HomeHowItWorks');
    
    const steps = [
        { key: 'registration', number: 1 },
        { key: 'search', number: 2 },
        { key: 'communication', number: 3 },
        { key: 'meeting', number: 4 }
    ];
    
    return (
        <section className={styles.section} id="how-it-works">
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                
                <div className={styles.steps}>
                    {steps.map((step) => (
                        <div key={step.key} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <h3 className={styles.stepTitle}>
                                {t(`steps.${step.key}.title`)}
                            </h3>
                            <p className={styles.stepDescription}>
                                {t(`steps.${step.key}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className={styles.cta}>
                    <Link href="/account" className={styles.button}>{t('button')}</Link>
                </div>
            </div>
        </section>
    );
}
