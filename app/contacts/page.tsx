import Link from 'next/link';
import { FaTelegramPlane, FaVk, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import styles from './page.module.css';
import { Metadata } from 'next';
import ContactForm from './components/ContactForm/ContactForm';

export const metadata: Metadata = {
    title: "Контакты Friends4Evening | Сервис встреч и общения",
    description: "Способы связи с сервисом Friends4Evening, информация о компании, форма обратной связи, наши соцсети и часто задаваемые вопросы",
    keywords: ["контакты", "соцсети", "информация о компании", "f4e", "friends4evening", "сервис знакомств", "сервис встреч", "поиск встреч"]
}

export default function Contacts() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Контакты</h1>
                    <p className={styles.subtitle}>
                        Свяжитесь с нами, если у вас есть вопросы или предложения
                    </p>
                </div>

                <section className={styles.contactSection}>
                    <div className={styles.contactInfo}>
                        <div className={styles.companyInfo}>
                            <h2 className={styles.companyTitle}>Информация о компании</h2>
                            <div className={styles.companyDetails}>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>Название:</span>
                                    <span className={styles.companyDetailValue}>LOVIGIN LTD</span>
                                </div>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>Адрес:</span>
                                    <span className={styles.companyDetailValue}>86-90 Paul Street London EC2A 4NE, United Kingdom</span>
                                </div>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>Company Number:</span>
                                    <span className={styles.companyDetailValue}>16203160</span>
                                </div>
                                <div className={styles.companyDetailItem}>
                                    <span className={styles.companyDetailLabel}>ICO Registration:</span>
                                    <span className={styles.companyDetailValue}>ZC026591</span>
                                </div>
                            </div>
                        </div>

                        <h2 className={styles.contactInfoTitle}>Свяжитесь с нами</h2>
                        
                        <div className={styles.contactItem}>
                            <div className={styles.contactIconWrapper}>
                                <span className={styles.contactIcon}>📧</span>
                            </div>
                            <div className={styles.contactDetails}>
                                <h3 className={styles.contactItemTitle}>Электронная почта</h3>
                                <a href="mailto:Friends4Evening@lovigin.com" className={styles.contactEmail}>
                                    Friends4Evening@lovigin.com
                                </a>
                            </div>
                        </div>

                        <div className={styles.socialSection}>
                            <h3 className={styles.socialTitle}>Мы в социальных сетях</h3>
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
                        <h2 className={styles.formTitle}>Форма обратной связи</h2>
                        <ContactForm />
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Часто задаваемые вопросы</h2>
                    <div className={styles.content}>
                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>Как связаться с поддержкой?</h3>
                            <p className={styles.faqAnswer}>
                                Вы можете написать нам на почту <Link href="mailto:Friends4Evening@lovigin.com" className={styles.link}>Friends4Evening@lovigin.com</Link> или обратиться через форму обратной связи. Мы стараемся отвечать в течение 24 часов.
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>Как сообщить о нарушении?</h3>
                            <p className={styles.faqAnswer}>
                                Если вы столкнулись с нарушением правил поведения, пожалуйста, используйте кнопку «Пожаловаться» в профиле пользователя или напишите нам на почту с описанием ситуации.
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>Как предложить улучшение сервиса?</h3>
                            <p className={styles.faqAnswer}>
                                Мы всегда рады вашим предложениям! Напишите нам на почту или заполните форму обратной связи с описанием вашей идеи, и мы обязательно рассмотрим её.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Полезные ссылки</h2>
                    <div className={styles.linksGrid}>
                        <Link href="/rules" className={styles.infoLink}>
                            <span className={styles.linkIcon}>📋</span>
                            <span className={styles.linkText}>Правила поведения</span>
                        </Link>
                        <Link href="/agreement" className={styles.infoLink}>
                            <span className={styles.linkIcon}>📄</span>
                            <span className={styles.linkText}>Пользовательское соглашение</span>
                        </Link>
                        <Link href="/privacy" className={styles.infoLink}>
                            <span className={styles.linkIcon}>🔒</span>
                            <span className={styles.linkText}>Политика конфиденциальности</span>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
