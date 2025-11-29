"use client";

import { Meet } from "@/models/Meet";
import { useState } from "react";
import styles from "./Settings.module.css";
import { useRouter } from "next/navigation";

export default function Settings({ meet }: { meet: Meet }) {
    const router = useRouter();
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
            alert('Ошибка при сохранении изменений');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Вы уверены, что хотите удалить эту встречу? Это действие нельзя отменить.')) {
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
            alert('Ошибка при удалении встречи');
            setDeleteLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <span>Название встречи</span>
                        <input
                            type="text"
                            className={styles.input}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                            placeholder="Введите название встречи"
                        />
                    </label>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <span>Описание</span>
                        <textarea
                            className={styles.textarea}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Введите описание встречи"
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
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </form>

            <div className={styles.deleteSection}>
                <p className={styles.deleteDescription}>
                    Удаление встречи нельзя отменить. Все данные будут безвозвратно удалены.
                </p>
                <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={deleteLoading}
                >
                    {deleteLoading ? 'Удаление...' : 'Удалить встречу'}
                </button>
            </div>
        </div>
    );
}
