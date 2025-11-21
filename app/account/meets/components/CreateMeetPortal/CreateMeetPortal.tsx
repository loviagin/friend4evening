"use client";
import { createPortal } from 'react-dom';
import { useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { ages, meetType } from "../Meets/Meets";
import styles from "./CreateMeetPortal.module.css";
import { AiOutlineClose } from "react-icons/ai";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import "@/components/daypicker-custom.css";
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '@/app/_providers/AuthProvider';

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
                + Заявка на встречу
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
    membersCount: number | null,
    noAlcohol: boolean,
    ageRange: string,
    meetType: string,
    date: Date,
    duration: string,
}

export function CreateMeetContent({ close }: Props) {
    const auth = useAuth();

    const [form, setForm] = useState<MeetApplicationProps>({
        title: "",
        description: "",
        location: "",
        membersCount: 0,
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

        // if (Timestamp.fromDate(form.date) === undefined) {
        //     alert("Необходимо указать время")
        //     return
        // }
        console.log(form.date)
        if (!auth.user) return;

        const response = await fetch(`/api/applications`, {
            method: "POST",
            body: JSON.stringify({
                ...form,
                ownerId: auth.user.uid,
                date: form.date instanceof Date ? form.date.toISOString() : form.date
            })
        })

        const data = await response.json();

        if (response.status === 200) {
            alert("Заявка успешно создана")
            console.log(data)
            close();
        }
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
                                    type="number"
                                    className={styles.input}
                                    value={form.membersCount ?? 0}
                                    onChange={(e) => setForm({ ...form, membersCount: parseInt(e.target.value) })}
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
                                            {Array.from({ length: 24 * 4 }, (_, i) => {
                                                const hours = Math.floor(i / 4);
                                                const minutes = (i % 4) * 15;
                                                const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                                const isSelected = form.date.getHours() === hours && form.date.getMinutes() === minutes;

                                                return (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        className={`${styles.timeButton} ${isSelected ? styles.timeButtonSelected : ''}`}
                                                        onClick={() => {
                                                            const newDate = new Date(form.date);
                                                            newDate.setHours(hours);
                                                            newDate.setMinutes(minutes);
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
            </div>
        </div>
    )
}