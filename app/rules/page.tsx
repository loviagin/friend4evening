import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('legal.rules');
    
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function Rules() {
    const t = await getTranslations('legal.rules');
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('title')}</h1>
                    <p className={styles.version}>{t('version')}</p>
                </div>

                <div className={styles.intro}>
                    <p>
                        {t('intro')}
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.1.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>1.1.</strong> {t('sections.1.item1')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.2.</strong> {t('sections.1.item2')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.3.</strong> {t('sections.1.item3')}
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.2.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>2.1.</strong> {t('sections.2.item1')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>2.2.</strong> {t('sections.2.item2')}
                        </p>
                        <ul className={styles.list}>
                            <li>{t('sections.2.list.item1')}</li>
                            <li>{t('sections.2.list.item2')}</li>
                            <li>{t('sections.2.list.item3')}</li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>2.3.</strong> {t('sections.2.item3')}
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.3.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            {t('sections.3.intro')}
                        </p>
                        <ul className={styles.list}>
                            <li>{t('sections.3.list.item1')}</li>
                            <li>{t('sections.3.list.item2')}</li>
                            <li>{t('sections.3.list.item3')}</li>
                            <li>{t('sections.3.list.item4')}</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.4.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>4.1.</strong> {t('sections.4.item1')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>4.2.</strong> {t('sections.4.item2')}
                        </p>
                        <ul className={styles.list}>
                            <li>{t('sections.4.list.item1')}</li>
                            <li>{t('sections.4.list.item2')}</li>
                            <li>{t('sections.4.list.item3')}</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.5.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>5.1.</strong> {t('sections.5.item1')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>5.2.</strong> {t('sections.5.item2')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>5.3.</strong> {t('sections.5.item3')}
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.6.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>6.1.</strong> {t('sections.6.item1')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>6.2.</strong> {t('sections.6.item2')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>6.3.</strong> {t('sections.6.item3')}
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.7.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>7.1.</strong> {t('sections.7.item1')}
                        </p>
                        <p className={styles.paragraph}>
                            <strong>7.2.</strong> {t('sections.7.item2')}
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('sections.8.title')}</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            {t('sections.8.text')} <Link href="mailto:Friends4Evening@lovigin.com" className={styles.link}>Friends4Evening@lovigin.com</Link>
                        </p>
                    </div>
                </section>

                <div className={styles.contacts}>
                    <p className={styles.copyright}>
                        {t('copyright')}<br />
                        {t('ageRestriction')}
                    </p>
                </div>
            </div>
        </main>
    );
}