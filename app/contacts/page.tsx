import Link from 'next/link';
import { FaTelegramPlane, FaVk, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { getTranslations, getLocale } from 'next-intl/server';
import { Metadata } from 'next';
import styles from './page.module.css';
import ContactForm from './components/ContactForm/ContactForm';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Contacts');
    const locale = await getLocale();
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const keywords = messages.Contacts?.metaKeywords || [];
    
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        keywords: Array.isArray(keywords) ? keywords : [],
    };
}

export default async function Contacts() {
    const t = await getTranslations('Contacts');
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('title')}</h1>
                    <p className={styles.subtitle}>
                        {t('subtitle')}
                    </p>
                </div>

                <section className={styles.contactSection}>
                    <div className={styles.contactInfo}>
                        <div className={styles.companyInfo}>
                            <h2 className={styles.companyTitle}>{t('companyInfo.title')}</h2>
                            <div className={styles.companyDetails}>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>{t('companyInfo.labels.name')}</span>
                                    <span className={styles.companyDetailValue}>{t('companyInfo.values.name')}</span>
                                </div>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>{t('companyInfo.labels.address')}</span>
                                    <span className={styles.companyDetailValue}>{t('companyInfo.values.address')}</span>
                                </div>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>{t('companyInfo.labels.companyNumber')}</span>
                                    <span className={styles.companyDetailValue}>{t('companyInfo.values.companyNumber')}</span>
                                </div>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>{t('companyInfo.labels.icoRegistration')}</span>
                                    <span className={styles.companyDetailValue}>{t('companyInfo.values.icoRegistration')}</span>
                                </div>
                            </div>
                        </div>

                        <h2 className={styles.contactInfoTitle}>{t('contactUs')}</h2>
                        
                        <div className={styles.contactItem}>
                            <div className={styles.contactIconWrapper}>
                                <span className={styles.contactIcon}>📧</span>
                            </div>
                            <div className={styles.contactDetails}>
                                <h3 className={styles.contactItemTitle}>{t('email.title')}</h3>
                                <a href="mailto:Friends4Evening@lovigin.com" className={styles.contactEmail}>
                                    Friends4Evening@lovigin.com
                                </a>
                            </div>
                        </div>

                        <div className={styles.socialSection}>
                            <h3 className={styles.socialTitle}>{t('social.title')}</h3>
                            <div className={styles.socialLinks}>
                                <a href="https://t.me/loviginsup" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                    <FaTelegramPlane className={styles.socialIcon} />
                                </a>
                                <a href="https://wa.me/447867246591" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="VK">
                                    <FaWhatsapp className={styles.socialIcon} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactForm}>
                        <h2 className={styles.formTitle}>{t('form.title')}</h2>
                        <ContactForm />
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('faq.title')}</h2>
                    <div className={styles.content}>
                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>{t('faq.items.support.question')}</h3>
                            <p className={styles.faqAnswer}>
                                {t('faq.items.support.answer').split('Friends4Evening@lovigin.com').map((part, i, arr) => 
                                    i === arr.length - 1 ? part : (
                                        <span key={i}>
                                            {part}
                                            <Link href="mailto:Friends4Evening@lovigin.com" className={styles.link}>Friends4Evening@lovigin.com</Link>
                                        </span>
                                    )
                                )}
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>{t('faq.items.report.question')}</h3>
                            <p className={styles.faqAnswer}>
                                {t('faq.items.report.answer')}
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>{t('faq.items.suggestions.question')}</h3>
                            <p className={styles.faqAnswer}>
                                {t('faq.items.suggestions.answer')}
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('usefulLinks.title')}</h2>
                    <div className={styles.linksGrid}>
                        <Link href="/rules" className={styles.infoLink}>
                            <span className={styles.linkIcon}>📋</span>
                            <span className={styles.linkText}>{t('usefulLinks.rules')}</span>
                        </Link>
                        <Link href="/agreement" className={styles.infoLink}>
                            <span className={styles.linkIcon}>📄</span>
                            <span className={styles.linkText}>{t('usefulLinks.agreement')}</span>
                        </Link>
                        <Link href="/privacy" className={styles.infoLink}>
                            <span className={styles.linkIcon}>🔒</span>
                            <span className={styles.linkText}>{t('usefulLinks.privacy')}</span>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
