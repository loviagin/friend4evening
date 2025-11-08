import { MeetTypeLabels, User } from "@/models/User"
import styles from "./GeneralProfile.module.css"

type Props = {
    user: User | null,
}

export default function GeneralProfile({ user }: Props) {

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

            {/* Statistic block */}

            {/* Reviews block */}

            {/* Additional actions block (жалоба, блокировка/разблокировка, ) */}
            
        </section>
    )
}