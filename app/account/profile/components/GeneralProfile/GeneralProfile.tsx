"use client"
import { useState, useEffect } from "react"
import { User } from "@/models/User"
import { useTranslations } from "next-intl"
import styles from "./GeneralProfile.module.css"
import { Review } from "@/models/Review"
import UserReview from "../UserReview/UserReview"
import WriteReview from "../WriteReview/WriteReview"
import { useAuth } from "@/app/_providers/AuthProvider"
import ReportForm from "../ReportForm/ReportForm"

type Props = {
    user: User | null,
}

type ReviewDTO = {
    reviews: Review[],
    average: number,
}

type MeetsCountDTO = {
    count: number,
}

type StatisticDTO = {
    meetsCount: number,
    friendsCount: number,
    daysFromRegistration: string
}

export default function GeneralProfile({ user }: Props) {
    const auth = useAuth();
    const tMeetType = useTranslations('MeetType');
    const t = useTranslations('GeneralProfile');
    const [reviewDTO, setReviewDTO] = useState<ReviewDTO>({ reviews: [], average: 0 });
    const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
    const [statisticDTO, setStatisticDTO] = useState<StatisticDTO>({ meetsCount: 0, friendsCount: 0, daysFromRegistration: "" });
    const [showReportForm, setShowReportForm] = useState(false);

    useEffect(() => {
        console.log("Loading reviews");
        const fetchReviews = async (id: string) => {
            const response = await fetch(`/api/reviews/${id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            })
            const data = await response.json();

            if (response.status === 200) {
                setReviewDTO(data as ReviewDTO);
                console.log("REVIEWS FOUND")
            } else {
                console.log("No reviews", data['message'])
            }
        }

        const fetchMeetsCount = async (id: string) => {
            const response = await fetch(`/api/meets/${id}/count`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });
            const data = await response.json();

            if (response.status === 200) {
                setStatisticDTO((prev) => ({
                    ...prev,
                    meetsCount: (data as MeetsCountDTO).count
                }))
            } else {
                console.log("error count meets", data);
            }
        }

        const fetchCurrentUser = async () => {
            if (!auth.user?.uid) return
            const response = await fetch(`/api/users/${auth.user.uid}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });

            if (response.status === 200) {
                const data = await response.json();

                const d = data['blockedUsers']
                console.log("DEBUG", d)
                setBlockedUsers(d ?? []);
                console.log(blockedUsers)
            } else {
                console.log("error fetch blocked users");
            }
        }

        if (user) {
            const diffMs = new Date().getTime() - new Date(user.dateRegistered).getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            console.log(user.dateRegistered)
            console.log(diffMs)
            console.log(diffDays)

            setStatisticDTO((prev) => ({
                ...prev,
                friendsCount: user.friends?.length ?? 0,
                daysFromRegistration: diffDays > 30
                    ? `${Math.floor(diffDays / 30)} ${t('time.months')}`
                    : `${diffDays} ${t('time.days')}`
            }));
            fetchMeetsCount(user.id);
            fetchReviews(user.id);
            fetchCurrentUser();
        }
    }, [user]);

    const handleBlock = async () => {
        if (!auth.user?.uid || !user) return

        const response = await fetch(`/api/users/${auth.user.uid}/block`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ userId: user.id })
        });

        const data = await response.json();
        if (response.status === 200) {
            setBlockedUsers((prev) => ([
                ...prev, user.id
            ]))
        } else {
            console.log("Error handle block")
        }
    }

    const handleUnblock = async () => {
        if (!auth.user?.uid || !user) return

        const response = await fetch(`/api/users/${auth.user.uid}/unblock`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ userId: user.id })
        });

        const data = await response.json();
        if (response.status === 200) {
            setBlockedUsers((prev) => ([
                ...prev.filter((u) => u !== user.id)
            ]))
        } else {
            console.log("Error handle block")
        }
    }

    return (
        <section className={styles.section}>
            {user?.bio && <p className={styles.bio}>{user?.bio}</p>}
            {/* Location block */}
            {(user?.location && (user.location.city.length > 0 || user.location.country.length > 0)) &&
                <div className={styles.infoBlock}>
                    <h2 className={styles.infoBlockTitle}>{t('location')}</h2>
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
                    <h2 className={styles.infoBlockTitle}>{t('drinks.title')}</h2>
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
                            {t('drinks.noAlcohol')}
                        </div>
                    }
                </div>
            }

            {user?.noSmoking && user.noSmoking === true &&
                <div className={styles.infoBlock}>
                    <div className={styles.noSmokingBadge}>
                        {t('noSmoking')}
                    </div>
                </div>
            }

            {/* Meet (in) Preferences block */}
            {user?.meetIn && user.meetIn.length > 0 &&
                <div className={styles.infoBlock}>
                    <h2 className={styles.infoBlockTitle}>{t('meetIn')}</h2>
                    <div className={styles.meetInList}>
                        {user.meetIn.map((place) => (
                            <div key={place} className={styles.meetInItem}>
                                ✅ {tMeetType(place)}
                            </div>
                        ))}
                    </div>
                </div>
            }

            {user?.readyToTrip && user.readyToTrip === true &&
                <div className={styles.infoBlock}>
                    <div className={styles.readyToTripBadge}>
                        {t('readyToTrip')}
                    </div>
                </div>
            }

            {/* Statistic block – count of meets, count of friends, count of days from dateRegistered */}
            <div className={styles.statisticsBlock}>
                <h2 className={styles.infoBlockTitle}>{t('statistics.title')}</h2>
                <div className={styles.statisticsGrid}>
                    <div className={styles.statisticItem}>
                        <div className={styles.statisticNumber}>{statisticDTO.meetsCount}</div>
                        <p className={styles.statisticLabel}>{t('statistics.meetsCount')}</p>
                    </div>

                    <div className={styles.statisticItem}>
                        <div className={styles.statisticNumber}>{statisticDTO.friendsCount}</div>
                        <p className={styles.statisticLabel}>{t('statistics.friendsCount')}</p>
                    </div>

                    <div className={styles.statisticItem}>
                        <div className={styles.statisticNumber}>{statisticDTO.daysFromRegistration}</div>
                        <p className={styles.statisticLabel}>{t('statistics.daysFromRegistration')}</p>
                    </div>
                </div>
            </div>

            {/* Reviews block */}
            <div className={styles.reviewsBlock} id="reviews">
                <h2 className={styles.infoBlockTitle}>{t('reviews.title')}</h2>
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
                                {t('reviews.averageRating')}
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
                        {t('reviews.emptyState')}
                    </div>
                }
            </div>

            {/* Additional actions block (жалоба, блокировка/разблокировка, ) */}
            {(user?.id !== auth.user?.uid && user) && (
                <div className={styles.actionsBlock}>
                    {blockedUsers && auth.user && (
                        <>
                            {(Array.isArray(blockedUsers) && blockedUsers.includes(user.id)) ? (
                                <button className={styles.buttonUnblock} onClick={handleUnblock}>
                                    {t('actions.unblock')}
                                </button>
                            ) : (
                                <button className={styles.buttonBlock} onClick={handleBlock}>
                                    {t('actions.block')}
                                </button>
                            )}
                        </>
                    )}
                    {auth.user && (
                        <button className={styles.buttonReport} onClick={() => setShowReportForm(true)}>
                            {t('actions.report')}
                        </button>
                    )}
                </div>
            )}
            {showReportForm && user && (
                <ReportForm userId={user.id} close={() => setShowReportForm(false)} />
            )}
        </section>
    )
}