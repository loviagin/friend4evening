
"use client"
import { useState, useEffect } from "react"
import styles from "./WriteReview.module.css"

type Props = {
    reviewerId: string,
    userId: string
}

type Form = {
    rating: number,
    text: string,
}

const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function WriteReview({ reviewerId, userId }: Props) {
    const [allow, setAllow] = useState(false);
    const [form, setForm] = useState<Form>({ rating: 0, text: "" });

    useEffect(() => {
        const fetchReviewAllowance = async () => {
            const response = await fetch(`/api/meets/${reviewerId}/completed/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });
            const data = await response.json();

            if (response.status === 200) {
                setAllow(data['completed'] as boolean);
            } else {
                console.log("ERROR LOADING ALLOWANCE");
            }
        }

        fetchReviewAllowance()
    }, [reviewerId, userId])

    const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form)

        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ ...form, reviewerId, userId })
        })
        const data = await response.json();

        if (response.status === 200) {
            alert("Отзыв успешно отправлен. Спасибо");
            window.location.reload();
        } else {
            alert("Ошибка отправки. Попробуйте попозже");
        }
    }


    if (allow === false) {
        return (
            <div className={styles.container}>
                <p className={styles.message}>
                    Отзыв можно оставить только после завершенной встречи
                </p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} id="review-form" onSubmit={handleReviewSubmit}>
                <div className={styles.ratingSection}>
                    <div className={styles.ratingLabel}>Оценка:</div>
                    <div className={styles.starsContainer}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setForm({ ...form, rating: i + 1 })}
                                className={`${styles.starButton} ${form.rating > i ? styles.active : ''}`}
                                type="button"
                                aria-label={`Оценить ${i + 1} звезд${i === 0 ? 'ой' : i < 4 ? 'ами' : 'ами'}`}
                            >
                                <StarIcon className={styles.starIcon} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.textareaSection}>
                    <label className={styles.textareaLabel} htmlFor="review-text">
                        Ваш отзыв:
                    </label>
                    <textarea
                        id="review-text"
                        className={styles.textarea}
                        value={form.text}
                        onChange={(e) => setForm({ ...form, text: e.target.value })}
                        placeholder="Напишите свой отзыв"
                        rows={6}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={form.rating === 0 || form.text.trim().length === 0}
                >
                    Отправить отзыв
                </button>
            </form>
        </div>
    )
}