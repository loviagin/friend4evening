import { FaApple, FaAndroid } from 'react-icons/fa';
import { IoShareOutline } from 'react-icons/io5';
import styles from './page.module.css';
import { LuSquarePlus } from 'react-icons/lu';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Apps' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        keywords: t('metaKeywords') as unknown as string[],
    };
}

export default async function AppsPage() {
    const t = await getTranslations('Apps');
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('header.title')}</h1>
                    <p className={styles.subtitle}>
                        {t('header.subtitle')}
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('pwa.title')}</h2>
                    
                    <div className={styles.instructionsGrid}>
                        <div className={styles.instructionCard}>
                            <div className={styles.instructionHeader}>
                                <div className={styles.platformIcon}>
                                    <FaApple className={styles.icon} />
                                </div>
                                <h3 className={styles.platformTitle}>{t('pwa.ios.title')}</h3>
                            </div>
                            <ol className={styles.stepsList}>
                                <li className={styles.step}>
                                    {t('pwa.ios.steps.step1')}
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.ios.steps.step2')} <span className={styles.buttonHint}>
                                        <IoShareOutline className={styles.inlineIcon} /> {t('pwa.ios.steps.shareButton')}
                                    </span> {t('pwa.ios.steps.step2End')}
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.ios.steps.step3')} <span className={styles.buttonHint}>
                                        <LuSquarePlus className={styles.inlineIcon} /> {t('pwa.ios.steps.addToHome')}
                                    </span>
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.ios.steps.step4')}
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.ios.steps.step5')}
                                </li>
                            </ol>
                        </div>

                        <div className={styles.instructionCard}>
                            <div className={styles.instructionHeader}>
                                <div className={styles.platformIcon}>
                                    <FaAndroid className={styles.icon} />
                                </div>
                                <h3 className={styles.platformTitle}>{t('pwa.android.title')}</h3>
                            </div>
                            <ol className={styles.stepsList}>
                                <li className={styles.step}>
                                    {t('pwa.android.steps.step1')}
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.android.steps.step2')} <span className={styles.buttonHint}>
                                        {t('pwa.android.steps.menuIcon')}
                                    </span> {t('pwa.android.steps.step2End')}
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.android.steps.step3')} <span className={styles.buttonHint}>
                                        {t('pwa.android.steps.installOption')}
                                    </span>
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.android.steps.step4')}
                                </li>
                                <li className={styles.step}>
                                    {t('pwa.android.steps.step5')}
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('native.title')}</h2>
                    <p className={styles.sectionDescription}>
                        {t('native.description')}
                    </p>
                    
                    <div className={styles.appsGrid}>
                        <div className={styles.appCard}>
                            <div className={styles.appCardContent}>
                                <div className={styles.appIconWrapper}>
                                    <FaApple className={styles.appIcon} />
                                </div>
                                <h3 className={styles.appTitle}>{t('native.ios.title')}</h3>
                                <p className={styles.appDescription}>
                                    {t('native.ios.description')}
                                </p>
                                <div className={styles.statusBadge}>
                                    <span className={styles.statusText}>{t('native.ios.status')}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.appCard}>
                            <div className={styles.appCardContent}>
                                <div className={styles.appIconWrapper}>
                                    <FaAndroid className={styles.appIcon} />
                                </div>
                                <h3 className={styles.appTitle}>{t('native.android.title')}</h3>
                                <p className={styles.appDescription}>
                                    {t('native.android.description')}
                                </p>
                                <div className={styles.statusBadge}>
                                    <span className={styles.statusText}>{t('native.android.status')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
