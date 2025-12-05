import Link from 'next/link';
import styles from './Hero.module.css';
import { useTranslations } from 'next-intl';

export default function HomeHero() {
    const t = useTranslations('HomeHero');
    return (
        <section className={styles.hero} id="hero">
            <div className={styles.content}>
                <h1 className={styles.title}>Friends4Evening</h1>
                <p className={styles.subtitle}>{t('subtitle')}</p>
                <p className={styles.description}>
                    {t('description')}
                <br />
                    <b>{t('descriptionBold')}</b>
                </p>
                <div className={styles.ctaButtons}>
                    <Link href="/account" className={`${styles.button} ${styles.buttonPrimary}`}>
                        {t('startSearchButton')}
                    </Link>
                    <Link href="#how-it-works" className={`${styles.button} ${styles.buttonSecondary}`}>
                        {t('learnMoreButton')}
                    </Link>
                </div>
            </div>
        </section>
    );
}