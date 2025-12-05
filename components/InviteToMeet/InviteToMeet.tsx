"use client";

import { createPortal } from 'react-dom';
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import { Meet } from "@/models/Meet";
import styles from "./InviteToMeet.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from '@/app/_providers/AuthProvider';
import LoadingView from '@/components/LoadingView/LoadingView';
import { useTranslations, useLocale } from 'next-intl';
import { getAges, getMeetTypes } from '@/app/account/meets/components/Meets/Meets';
import Dropdown from '@/components/Dropdown/Dropdown';
import { DayPicker } from "react-day-picker";
import { ru, enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "@/components/daypicker-custom.css";

type Props = {
    user: User;
    close: () => void;
}

type InviteMode = 'existing' | 'new';

type NewMeetForm = {
    title: string;
    description: string;
    location: string;
    date: Date;
    duration: string;
    ageRange: string;
    meetType: string;
    noAlcohol: boolean;
}

export default function InviteToMeet({ user, close }: Props) {
    const auth = useAuth();
    const t = useTranslations('InviteToMeet');
    const tMeets = useTranslations('Meets');
    const locale = useLocale();
    const [mounted, setMounted] = useState(false);
    const [mode, setMode] = useState<InviteMode>('existing');
    const [meets, setMeets] = useState<Meet[]>([]);
    const [selectedMeetId, setSelectedMeetId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [loadingMeets, setLoadingMeets] = useState(true);
    const [newMeetForm, setNewMeetForm] = useState<NewMeetForm>({
        title: '',
        description: '',
        location: '',
        date: new Date(),
        duration: '',
        ageRange: 'none',
        meetType: 'none',
        noAlcohol: false,
    });

    // getAges and getMeetTypes expect keys with 'Meets.' prefix, but tMeets already works with 'Meets' namespace
    // So we need to strip the 'Meets.' prefix before passing to tMeets
    const ages = getAges((key: string) => {
        const keyWithoutPrefix = key.replace(/^Meets\./, '');
        return tMeets(keyWithoutPrefix);
    });
    const meetTypes = getMeetTypes((key: string) => {
        const keyWithoutPrefix = key.replace(/^Meets\./, '');
        return tMeets(keyWithoutPrefix);
    });
    const dayPickerLocale = locale === 'ru' ? ru : enUS;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (mode === 'existing' && auth.user) {
            fetchUserMeets();
        }
    }, [mode, auth.user]);

    const fetchUserMeets = async () => {
        if (!auth.user) return;
        setLoadingMeets(true);
        try {
            const response = await fetch(`/api/meets/${auth.user.uid}/by/members`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                const userMeets = (data.meets as Meet[]).filter(meet => meet.status === 'plan' || meet.status === 'current');
                setMeets(userMeets);
            }
        } catch (error) {
            console.error('Error fetching meets:', error);
        } finally {
            setLoadingMeets(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    const handleInviteToExisting = async () => {
        if (!selectedMeetId || !auth.user) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/meets/one/${selectedMeetId}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });

            if (response.status === 200) {
                alert(t('alerts.inviteSuccess'));
                close();
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || t('alerts.inviteError'));
            }
        } catch (error) {
            console.error('Error inviting user:', error);
            alert(t('alerts.inviteError'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAndInvite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!auth.user) return;

        setLoading(true);
        try {
            // Создаем новую закрытую встречу
            const createResponse = await fetch(`/api/meets`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({
                    title: newMeetForm.title || undefined,
                    description: newMeetForm.description || undefined,
                    location: newMeetForm.location,
                    date: newMeetForm.date instanceof Date ? newMeetForm.date.toISOString() : newMeetForm.date,
                    duration: newMeetForm.duration || undefined,
                    ageRange: newMeetForm.ageRange === 'none' ? undefined : newMeetForm.ageRange,
                    meetType: newMeetForm.meetType === 'none' ? undefined : newMeetForm.meetType,
                    noAlcohol: newMeetForm.noAlcohol,
                    type: 'closed',
                    ownerId: auth.user.uid,
                }),
            });

            if (createResponse.status !== 200) {
                const errorData = await createResponse.json().catch(() => ({}));
                alert(errorData.message || t('alerts.createError'));
                setLoading(false);
                return;
            }

            const createData = await createResponse.json();
            const meetId = createData.id;

            // Приглашаем пользователя
            const inviteResponse = await fetch(`/api/meets/one/${meetId}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });

            if (inviteResponse.status === 200) {
                alert(t('alerts.createAndInviteSuccess'));
                close();
            } else {
                const errorData = await inviteResponse.json().catch(() => ({}));
                alert(errorData.message || t('alerts.inviteError'));
            }
        } catch (error) {
            console.error('Error creating meet and inviting:', error);
            alert(t('alerts.createError'));
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{t('title', { userName: user.name })}</h2>
                    <button className={styles.closeButton} onClick={close}>
                        <AiOutlineClose />
                    </button>
                </div>

                {loading ? (
                    <LoadingView />
                ) : (
                    <>
                        <div className={styles.modeSelector}>
                            <button
                                className={`${styles.modeButton} ${mode === 'existing' ? styles.modeButtonActive : ''}`}
                                onClick={() => setMode('existing')}
                            >
                                {t('modes.existing')}
                            </button>
                            <button
                                className={`${styles.modeButton} ${mode === 'new' ? styles.modeButtonActive : ''}`}
                                onClick={() => setMode('new')}
                            >
                                {t('modes.new')}
                            </button>
                        </div>

                        {mode === 'existing' ? (
                            <div className={styles.content}>
                                {loadingMeets ? (
                                    <LoadingView />
                                ) : meets.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        {t('emptyState.noMeets')}
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.meetsList}>
                                            {meets.map((meet) => (
                                                <div
                                                    key={meet.id}
                                                    className={`${styles.meetItem} ${selectedMeetId === meet.id ? styles.meetItemSelected : ''}`}
                                                    onClick={() => setSelectedMeetId(meet.id)}
                                                >
                                                    <div className={styles.meetItemTitle}>{meet.title || t('meet.defaultTitle', { id: meet.id.slice(0, 8) })}</div>
                                                    {meet.description && (
                                                        <div className={styles.meetItemDescription}>{meet.description}</div>
                                                    )}
                                                    {meet.location && (
                                                        <div className={styles.meetItemLocation}>📍 {meet.location}</div>
                                                    )}
                                                    <div className={styles.meetItemDate}>
                                                        📅 {new Date(meet.date instanceof Date ? meet.date : (meet.date as any).toDate?.() || meet.date).toLocaleDateString(
                                                            locale === 'ru' ? 'ru-RU' : 'en-US',
                                                            { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.submitButton}
                                                onClick={handleInviteToExisting}
                                                disabled={!selectedMeetId}
                                            >
                                                {t('buttons.invite')}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleCreateAndInvite}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>{t('form.labels.title')}</span>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={newMeetForm.title}
                                            onChange={(e) => setNewMeetForm({ ...newMeetForm, title: e.target.value })}
                                            placeholder={t('form.placeholders.title')}
                                        />
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>{t('form.labels.description')}</span>
                                        <textarea
                                            className={styles.textarea}
                                            value={newMeetForm.description}
                                            onChange={(e) => setNewMeetForm({ ...newMeetForm, description: e.target.value })}
                                            placeholder={t('form.placeholders.description')}
                                            rows={4}
                                        />
                                    </label>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            <span>{t('form.labels.location')}</span>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={newMeetForm.location}
                                                onChange={(e) => setNewMeetForm({ ...newMeetForm, location: e.target.value })}
                                                placeholder={t('form.placeholders.location')}
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            <span>{t('form.labels.duration')}</span>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                value={newMeetForm.duration}
                                                onChange={(e) => setNewMeetForm({ ...newMeetForm, duration: e.target.value })}
                                                placeholder={t('form.placeholders.duration')}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            <span>{t('form.labels.age')}</span>
                                            <Dropdown
                                                source={ages}
                                                current={newMeetForm.ageRange}
                                                onChange={(value) => setNewMeetForm({ ...newMeetForm, ageRange: value })}
                                            />
                                        </label>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>
                                            <span>{t('form.labels.meetType')}</span>
                                            <Dropdown
                                                source={meetTypes}
                                                current={newMeetForm.meetType}
                                                onChange={(value) => setNewMeetForm({ ...newMeetForm, meetType: value })}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>{t('form.labels.dateTime')}</span>
                                        <div className={styles.dateTimePicker}>
                                            <div className={styles.dayPickerWrapper}>
                                                <DayPicker
                                                    mode="single"
                                                    selected={newMeetForm.date}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            const newDate = new Date(date);
                                                            newDate.setHours(newMeetForm.date.getHours());
                                                            newDate.setMinutes(newMeetForm.date.getMinutes());
                                                            setNewMeetForm({ ...newMeetForm, date: newDate });
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
                                                        const isSelected = newMeetForm.date.getHours() === hours && newMeetForm.date.getMinutes() === 0;

                                                        return (
                                                            <button
                                                                key={i}
                                                                type="button"
                                                                className={`${styles.timeButton} ${isSelected ? styles.timeButtonSelected : ''}`}
                                                                onClick={() => {
                                                                    const newDate = new Date(newMeetForm.date);
                                                                    newDate.setHours(hours);
                                                                    newDate.setMinutes(0);
                                                                    newDate.setSeconds(0);
                                                                    newDate.setMilliseconds(0);
                                                                    setNewMeetForm({ ...newMeetForm, date: newDate });
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
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={newMeetForm.noAlcohol}
                                            onChange={(e) => setNewMeetForm({ ...newMeetForm, noAlcohol: e.target.checked })}
                                            className={styles.checkbox}
                                        />
                                        <span>{t('form.labels.noAlcohol')}</span>
                                    </label>
                                </div>

                                <div className={styles.actions}>
                                    <button type="button" className={styles.cancelButton} onClick={close}>
                                        {t('buttons.cancel')}
                                    </button>
                                    <button type="submit" className={styles.submitButton}>
                                        {t('buttons.createAndInvite')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}

