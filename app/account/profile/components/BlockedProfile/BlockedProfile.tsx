'use client';
import { useTranslations } from 'next-intl';
import styles from './BlockedProfile.module.css'

export default function BlockedProfile() {
    const t = useTranslations('BlockedProfile');
    return (
        <section className={styles.section}>
            <div className={styles.blockedContainer}>
                <span className={styles.icon}>🚫</span>
                <h1 className={styles.title}>{t('title')}</h1>
                <div className={styles.message}>
                    {t('message')}
                    <br />
                    {t('contactText')}{' '}
                    <a href="mailto:friends4evening@lovigin.com">friends4evening@lovigin.com</a>
                </div>
                <div className={styles.warningBox}>
                    <p className={styles.warningText}>
                        {t('warning')}
                    </p>
                </div>
            </div>
        </section>
    )
}