"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from '../../page.module.css';


export default function ContactForm() {
    const t = useTranslations('Contacts.ContactForm');
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
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                    {t('labels.name')}
                </label>
                <input
                    type="text"
                    id="name"
                    className={styles.input}
                    placeholder={t('placeholders.name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                    {t('labels.email')}
                </label>
                <input
                    type="email"
                    id="email"
                    className={styles.input}
                    placeholder={t('placeholders.email')}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                    {t('labels.message')}
                </label>
                <textarea
                    id="message"
                    className={styles.textarea}
                    placeholder={t('placeholders.message')}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                />
            </div>

            {submitStatus === 'success' && (
                <div className={styles.successMessage}>
                    {t('messages.success')}
                </div>
            )}

            {submitStatus === 'error' && (
                <div className={styles.errorMessage}>
                    {t('messages.error')}
                </div>
            )}

            <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
            >
                {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
            </button>
        </form>
    );
}
