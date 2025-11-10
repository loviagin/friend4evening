"use client"
import Avatar from "@/components/Avatar/Avatar"
import { Review } from "@/models/Review"
import { User } from "@/models/User"
import { useState, useEffect } from "react"
import styles from "./UserReview.module.css"

type Props = {
    review: Review,
}

export default function UserReview({ review }: Props) {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/users/${review.reviewerId}`);
            const data = await response.json();

            if (response.status !== 400) {
                setUser(data as User);
            } else {
                console.log("ERROR LOADING USER");
            }
        }

        fetchUser()
    }, [review])

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    return (
        <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
                <div className={styles.avatarWrapper}>
                    <Avatar avatarUrl={user?.avatarUrl} />
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.userName}>{user?.name || "Пользователь"}</div>
                    <div className={styles.rating}>
                        <div className={styles.ratingStars}>
                            {Array.from({ length: review.rating }).map((_, i) => (
                                <span key={i}>⭐️</span>
                            ))}
                        </div>
                        <span className={styles.ratingValue}>{review.rating}</span>
                    </div>
                </div>
            </div>
            {review.text && (
                <p className={styles.reviewText}>{review.text}</p>
            )}
            {review.date && (
                <div className={styles.reviewDate}>{formatDate(review.date)}</div>
            )}
        </div>
    )
}