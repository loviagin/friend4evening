"use client";

import { Meet } from "@/models/Meet";
import { useState } from "react";
import styles from "./Settings.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useTranslations } from 'next-intl';

export default function Settings({ meet }: { meet: Meet }) {
    const auth = useAuth();
    const router = useRouter();
    const t = useTranslations('Settings');
    const [form, setForm] = useState({
        title: meet.title || "",
        description: meet.description || "",
    });
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const response = await fetch(`/api/meets/one/${meet.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({
                title: form.title,
                description: form.description,
            }),
        });

        if (response.status === 200) {
            window.location.reload();
        } else {
            alert(t('errors.saveError'));
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(t('delete.confirm'))) {
            return;
        }

        setDeleteLoading(true);

        const response = await fetch(`/api/meets/one/${meet.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
        });

        if (response.status === 200) {
            router.push('/account/meets?tab=meets');
        } else {
            alert(t('errors.deleteError'));
            setDeleteLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {auth.user && auth.user.uid === meet.ownerId && (
                <>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span>{t('labels.title')}</span>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                    placeholder={t('placeholders.title')}
                                />
                            </label>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <span>{t('labels.description')}</span>
                                <textarea
                                    className={styles.textarea}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder={t('placeholders.description')}
                                    rows={6}
                                />
                            </label>
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="submit"
                                className={styles.saveButton}
                                disabled={loading}
                            >
                                {loading ? t('buttons.save.loading') : t('buttons.save.text')}
                            </button>
                        </div>
                    </form>

                    <div className={styles.deleteSection}>
                        <p className={styles.deleteDescription}>
                            {t('delete.description')}
                        </p>
                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? t('buttons.delete.loading') : t('buttons.delete.text')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
