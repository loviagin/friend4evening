"use client";
import Link from 'next/link';
import { useState } from 'react';
import { FaTelegramPlane, FaVk, FaInstagram } from 'react-icons/fa';
import styles from './page.module.css';

export default function Contacts() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', message: '' });
                
                // Сбрасываем статус через 5 секунд
                setTimeout(() => setSubmitStatus('idle'), 5000);
            } else {
                setSubmitStatus('error');
                console.error('Form submission error:', data.message);
            }
        } catch (error) {
            setSubmitStatus('error');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                <a href="#" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                                    <FaTelegramPlane className={styles.socialIcon} />
                                </a>
                                <a href="#" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="VK">
                                    <FaVk className={styles.socialIcon} />
                                </a>
                                <a href="#" className={styles.socialLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <FaInstagram className={styles.socialIcon} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contactForm}>
                        <h2 className={styles.formTitle}>Форма обратной связи</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    Ваше имя
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    className={styles.input}
                                    placeholder="Введите ваше имя"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={styles.input}
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.label}>
                                    Сообщение
                                </label>
                                <textarea
                                    id="message"
                                    className={styles.textarea}
                                    placeholder="Напишите ваше сообщение..."
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </div>

                            {submitStatus === 'success' && (
                                <div className={styles.successMessage}>
                                    ✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
                                </div>
                            )}

                            {submitStatus === 'error' && (
                                <div className={styles.errorMessage}>
                                    ✗ Произошла ошибка. Попробуйте еще раз или напишите нам напрямую на почту.
                                </div>
                            )}

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                            </button>
                        </form>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Часто задаваемые вопросы</h2>
                    <div className={styles.content}>
                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>Как связаться с поддержкой?</h3>
                            <p className={styles.faqAnswer}>
                                Вы можете написать нам на почту <Link href="mailto:Friends4Evening@lovigin.com" className={styles.link}>Friends4Evening@lovigin.com</Link>. Мы стараемся отвечать в течение 24 часов.
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
                                Мы всегда рады вашим предложениям! Напишите нам на почту с описанием вашей идеи, и мы обязательно рассмотрим её.
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
