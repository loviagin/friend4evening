"use client"
import { useState, useEffect } from "react"
import { MeetTypeLabels, User } from "@/models/User"
import styles from "./GeneralProfile.module.css"
import { Review } from "@/models/Review"
import UserReview from "../UserReview/UserReview"
import WriteReview from "../WriteReview/WriteReview"
import { useAuth } from "@/app/_providers/AuthProvider"

type Props = {
    user: User | null,
}

type ReviewDTO = {
    reviews: Review[],
    average: number,
}

export default function GeneralProfile({ user }: Props) {
    const auth = useAuth();
    const [reviewDTO, setReviewDTO] = useState<ReviewDTO>({ reviews: [], average: 0 });

    useEffect(() => {
        console.log("Loading reviews");
        const fetchReviews = async (id: string) => {
            const response = await fetch(`/api/reviews/${id}`)
            const data = await response.json();

            if (response.status === 200) {
                setReviewDTO(data as ReviewDTO);
                console.log("REVIEWS FOUND")
            } else {
                console.log("No reviews", data['message'])
            }
        }

        if (user) {
            fetchReviews(user.id)
        }
    }, [user])

    return (
        <section className={styles.section}>
            {user?.bio && <p className={styles.bio}>{user?.bio}</p>}
            {/* Location block */}
            {(user?.location && (user.location.city.length > 0 || user.location.country.length > 0)) &&
                <div className={styles.infoBlock}>
                    <h2 className={styles.infoBlockTitle}>🗺️ Локация</h2>
                    <div className={styles.locationContent}>
                        <div className={styles.locationText}>
                            {user.location.country && <span className={styles.locationItem}>{user.location.country}</span>}
                            {user.location.city && <span className={styles.locationItem}>{user.location.city}</span>}
                        </div>
                    </div>
                </div>
            }

            {/* Drink preferences */}
            {((user?.drinkPreferences && user.drinkPreferences.length > 0) || (user?.noAlcohol && user.noAlcohol === true)) &&
                <div className={styles.infoBlock}>
                    <h2 className={styles.infoBlockTitle}>Предпочитаемые напитки</h2>
                    {user.drinkPreferences && user.drinkPreferences.length > 0 && (
                        <div className={styles.drinksList}>
                            {user.drinkPreferences.map((drink) => (
                                <div key={drink} className={styles.drinkItem}>
                                    🍹 {drink}
                                </div>
                            ))}
                        </div>
                    )}

                    {user.noAlcohol && user.noAlcohol === true &&
                        <div className={styles.noAlcoholBadge}>
                            🚫 Без алкогольных напитков
                        </div>
                    }
                </div>
            }

            {user?.noSmoking && user.noSmoking === true &&
                <div className={styles.infoBlock}>
                    <div className={styles.noSmokingBadge}>
                        🚭 Не курю
                    </div>
                </div>
            }

            {/* Meet (in) Preferences block */}
            {user?.meetIn && user.meetIn.length > 0 &&
                <div className={styles.infoBlock}>
                    <h2 className={styles.infoBlockTitle}>Готов встретиться:</h2>
                    <div className={styles.meetInList}>
                        {user.meetIn.map((place) => (
                            <div key={place} className={styles.meetInItem}>
                                ✅ {MeetTypeLabels[place]}
                            </div>
                        ))}
                    </div>
                </div>
            }

            {user?.readyToTrip && user.readyToTrip === true &&
                <div className={styles.infoBlock}>
                    <div className={styles.readyToTripBadge}>
                        ✅ Готов к поездке в другой город
                    </div>
                </div>
            }

            {/* Statistic block – count of meets, count of friends, count of days from registeredDate */}

            {/* Reviews block */}
            <div className={styles.reviewsBlock}>
                <h2 className={styles.infoBlockTitle}>⭐ Отзывы</h2>
                {((auth.user?.uid && user?.id) && auth.user.uid !== user.id) && (
                    <WriteReview reviewerId={auth.user.uid} userId={user.id} />
                )}
                {reviewDTO.reviews.length > 0 ?
                    <>
                        <div className={styles.averageRating}>
                            <div className={styles.averageStars}>
                                {Array.from({ length: Math.floor(reviewDTO.average) }).map((_, i) => <span key={i}>⭐️</span>)}
                            </div>
                            <div className={styles.averageValue}>
                                Средняя оценка:
                                <b>{reviewDTO.average}</b>
                            </div>
                        </div>
                        <div className={styles.reviewsList}>
                            {reviewDTO.reviews.map((r) => (
                                <UserReview key={r.id} review={r} />
                            ))}
                        </div>
                    </>
                    :
                    <div className={styles.emptyReviews}>
                        Пока отзывов не оставлено
                    </div>
                }
            </div>

            {/* Additional actions block (жалоба, блокировка/разблокировка, ) */}
            { user?.id !== auth.user?.uid && (
                <div>
                    <p>Пожаловаться / заблокировать</p>
                </div>
            )}

        </section>
    )
}