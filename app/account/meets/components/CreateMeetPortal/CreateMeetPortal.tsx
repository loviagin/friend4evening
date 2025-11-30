"use client";
import { createPortal } from 'react-dom';
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { ages, meetType } from "../Meets/Meets";
import styles from "./CreateMeetPortal.module.css";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "@/components/daypicker-custom.css";
import { useAuth } from '@/app/_providers/AuthProvider';
import LoadingView from '@/components/LoadingView/LoadingView';

type Props = {
    close: () => void
}

export default function CreateMeetPortal() {
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
                <span className={styles.buttonText}>Заявка на встречу</span>
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
    const [loading, setLoading] = useState(false);

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
            alert("Заявка успешно создана")
            console.log(data)
            close();
        } else {
            alert("Ошибка создания заявки. Пожалуйста попробуйте позже")
        }

        setLoading(false);
    }

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <h2 className={styles.title}>Создать заявку на встречу</h2>
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
                                    <span>Название встречи</span>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Введите название (необязательно)"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <span>Описание</span>
                                    <textarea
                                        className={styles.textarea}
                                        placeholder="Опишите, что вы планируете делать (необязательно)"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={4}
                                    />
                                </label>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>Местоположение</span>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Город или адрес"
                                            value={form.location}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            required
                                        />
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>Количество участников</span>
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
                                            placeholder="Не ограничено, если пусто"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>Возраст</span>
                                        <Dropdown
                                            source={ages}
                                            current={form.ageRange}
                                            onChange={(value) => setForm({ ...form, ageRange: value })}
                                        />
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>Где встретиться</span>
                                        <Dropdown
                                            source={meetType}
                                            current={form.meetType}
                                            onChange={(value) => setForm({ ...form, meetType: value })}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span>Дата и время</span>
                                        <div className={styles.dateTimePicker}>
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
                                                locale={ru}
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                                className={styles.dayPicker}
                                            />
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
                                        <span>Длительность</span>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="Например: 2 часа, 3-4 часа"
                                            value={form.duration}
                                            onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={form.noAlcohol}
                                        onChange={(e) => setForm({ ...form, noAlcohol: e.target.checked })}
                                        className={styles.checkbox}
                                    />
                                    <span>Без алкоголя</span>
                                </label>
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.cancelButton} onClick={close}>
                                    Отмена
                                </button>
                                <button type="submit" className={styles.submitButton}>
                                    Создать заявку
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}