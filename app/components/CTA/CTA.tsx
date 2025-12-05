import Link from 'next/link';
import styles from './CTA.module.css';
import { useTranslations } from 'next-intl';

export default function CTA() {
    const t = useTranslations('HomeCTA');
    
    return (
        <section className={styles.section} id="cta">
            <div className={styles.container}>
                <h2 className={styles.title}>{t('title')}</h2>
                <p className={styles.subtitle}>
                    {t('subtitle')}
                </p>
                <div className={styles.buttons}>
                    <Link href="/login" className={styles.buttonPrimary}>
                        {t('registerButton')}
                    </Link>
                    <Link href="/account" className={styles.buttonSecondary}>
                        {t('loginButton')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
