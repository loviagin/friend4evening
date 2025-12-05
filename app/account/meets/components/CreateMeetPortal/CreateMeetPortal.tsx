"use client";
import { createPortal } from 'react-dom';
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { getAges, getMeetTypes } from "../Meets/Meets";
import styles from "./CreateMeetPortal.module.css";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { DayPicker } from "react-day-picker";
import { ru, enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "@/components/daypicker-custom.css";
import { useAuth } from '@/app/_providers/AuthProvider';
import LoadingView from '@/components/LoadingView/LoadingView';
import { useTranslations, useLocale } from 'next-intl';

type Props = {
    close: () => void
}

export default function CreateMeetPortal() {
    const t = useTranslations('CreateMeetPortal');
    const [showPortal, setShowPortal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, [])

    return (
        <>
            <button className={styles.openButton} onClick={() => setShowPortal(true)}>
                <AiOutlinePlusCircle />
                <span className={styles.buttonText}>{t('button')}</span>
            </button>
            {showPortal && mounted && createPortal(
                <CreateMeetContent close={() => setShowPortal(false)} />,
                document.body
            )}
        </>
    )
}

type MeetApplicationProps = {
    title: string,
    description: string,
    location: string,
    membersCount: string,
    noAlcohol: boolean,
    ageRange: string,
    meetType: string,
    date: Date,
    duration: string,
}

export function CreateMeetContent({ close }: Props) {
    const auth = useAuth();
    const t = useTranslations('CreateMeetPortal');
    const tMeets = useTranslations('Meets');
    const locale = useLocale();
    const [loading, setLoading] = useState(false);

    // Get localized arrays
    // getAges and getMeetTypes expect keys with 'Meets.' prefix, but tMeets already works with 'Meets' namespace
    // So we need to strip the 'Meets.' prefix before passing to tMeets
    const ages = getAges((key: string) => {
        const keyWithoutPrefix = key.replace(/^Meets\./, '');
        return tMeets(keyWithoutPrefix);
    });
    const meetType = getMeetTypes((key: string) => {
        const keyWithoutPrefix = key.replace(/^Meets\./, '');
        return tMeets(keyWithoutPrefix);
    });

    const [form, setForm] = useState<MeetApplicationProps>({
        title: "",
        description: "",
        location: "",
        membersCount: "",
        noAlcohol: false,
        ageRange: "none",
        meetType: "none",
        date: new Date(),
        duration: "",
    });

    const dayPickerLocale = locale === 'ru' ? ru : enUS;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);

        if (!auth.user) return;

        // Конвертируем membersCount из строки в number или null
        const membersCountValue = form.membersCount.trim() === ""
            ? null
            : parseInt(form.membersCount, 10);

        if (membersCountValue !== null && membersCountValue < 0) return;
        setLoading(true);

        const response = await fetch(`/api/meets`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({
                ...form,
                membersCount: membersCountValue,
                type: 'open',
                ownerId: auth.user.uid,
                date: form.date instanceof Date ? form.date.toISOString() : form.date
            })
        })

        const data = await response.json();

        if (response.status === 200) {
            alert(t('alerts.success'))
            console.log(data)
            close();
        } else {
            alert(t('alerts.error'))
        }

        setLoading(false);
    }

    return (
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
                    <>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <span>{t('labels.title')}</span>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder={t('placeholders.title')}
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
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
                                        rows={4}
                                    />
                                </label>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>{t('labels.location')}</span>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder={t('placeholders.location')}
                                            value={form.location}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            required
                                        />
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>{t('labels.membersCount')}</span>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={form.membersCount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value === "" || /^\d+$/.test(value)) {
                                                    setForm({ ...form, membersCount: value });
                                                }
                                            }}
                                            placeholder={t('placeholders.membersCount')}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>{t('labels.age')}</span>
                                        <Dropdown
                                            source={ages}
                                            current={form.ageRange}
                                            onChange={(value) => setForm({ ...form, ageRange: value })}
                                        />
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>{t('labels.meetType')}</span>
                                        <Dropdown
                                            source={meetType}
                                            current={form.meetType}
                                            onChange={(value) => setForm({ ...form, meetType: value })}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <span>{t('labels.dateTime')}</span>
                                    <div className={styles.dateTimePicker}>
                                        <div className={styles.dayPickerWrapper}>
                                            <DayPicker
                                                mode="single"
                                                selected={form.date}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const newDate = new Date(date);
                                                        newDate.setHours(form.date.getHours());
                                                        newDate.setMinutes(form.date.getMinutes());
                                                        setForm({ ...form, date: newDate });
                                                    }
                                                }}
                                                locale={dayPickerLocale}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                className={styles.dayPicker}
                                            />
                                        </div>
                                        <div className={styles.timePicker}>
                                            <div className={styles.timeGrid}>
                                                {Array.from({ length: 24 }, (_, i) => {
                                                    const hours = i;
                                                    const minutes = 0;
                                                    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                                    const isSelected = form.date.getHours() === hours && form.date.getMinutes() === 0;

                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            className={`${styles.timeButton} ${isSelected ? styles.timeButtonSelected : ''}`}
                                                            onClick={() => {
                                                                const newDate = new Date(form.date);
                                                                newDate.setHours(hours);
                                                                newDate.setMinutes(0);
                                                                newDate.setSeconds(0);
                                                                newDate.setMilliseconds(0);
                                                                setForm({ ...form, date: newDate });
                                                            }}
                                                        >
                                                            {timeString}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <span>{t('labels.duration')}</span>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder={t('placeholders.duration')}
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                    />
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={form.noAlcohol}
                                        onChange={(e) => setForm({ ...form, noAlcohol: e.target.checked })}
                                        className={styles.checkbox}
                                    />
                                    <span>{t('labels.noAlcohol')}</span>
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
                    </>
                )}
            </div>
        </div >
    )
}