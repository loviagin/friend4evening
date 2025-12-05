"use client";
import { createPortal } from 'react-dom';
import { useEffect, useState } from "react";
import styles from "./ReportForm.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "@/app/_providers/AuthProvider";
import LoadingView from '@/components/LoadingView/LoadingView';
import { useTranslations } from 'next-intl';

type Props = {
    userId: string;
    close: () => void;
}

type ReportFormData = {
    reason: string;
    description: string;
}

export default function ReportForm({ userId, close }: Props) {
    const auth = useAuth();
    const t = useTranslations('ReportForm');
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<ReportFormData>({
        reason: "",
        description: ""
    });

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!auth.user?.uid) return;

        if (!form.reason.trim() || !form.description.trim()) {
            alert(t('alerts.fillAllFields'));
            return;
        }

        setLoading(true);

        const response = await fetch(`/api/users/${userId}/report`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reason: form.reason,
                description: form.description,
                reporterId: auth.user.uid
            })
        });

        const data = await response.json();

        if (response.status === 200) {
            alert(t('alerts.success'));
            close();
        } else {
            alert(t('alerts.error'));
        }

        setLoading(false);
    };

    if (!mounted) return null;

    return createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{t('title')}</h2>
                    <button className={styles.closeButton} onClick={close}>
                        <AiOutlineClose />
                    </button>
                </div>

                {loading ? (
                    <LoadingView />
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span>{t('labels.reason')}</span>
                                <select
                                    className={styles.select}
                                    value={form.reason}
                                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                    required
                                >
                                    <option value="">{t('placeholders.reason')}</option>
                                    <option value="spam">{t('reasons.spam')}</option>
                                    <option value="inappropriate_content">{t('reasons.inappropriate_content')}</option>
                                    <option value="fake_profile">{t('reasons.fake_profile')}</option>
                                    <option value="scam">{t('reasons.scam')}</option>
                                    <option value="other">{t('reasons.other')}</option>
                                </select>
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span>{t('labels.description')}</span>
                                <textarea
                                    className={styles.textarea}
                                    placeholder={t('placeholders.description')}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={6}
                                    required
                                />
                            </label>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.cancelButton} onClick={close}>
                                {t('buttons.cancel')}
                            </button>
                            <button type="submit" className={styles.submitButton}>
                                {t('buttons.submit')}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}
