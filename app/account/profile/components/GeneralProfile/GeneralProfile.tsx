import { MeetTypeLabels, User } from "@/models/User"

type Props = {
    user: User | null,
}

export default function GeneralProfile({ user }: Props) {

    return (
        <section>
            {user?.bio && <p>{user?.bio}</p>}
            {/* Location block */}
            {(user?.location && (user.location.city.length > 0 || user.location.country.length > 0)) &&
                <div>
                    <h2>🗺️ Локация</h2>
                    <span>{user.location.country}</span>
                    <span>{user.location.city}</span>
                </div>
            }

            {/* Drink preferences */}
            {((user?.drinkPreferences && user.drinkPreferences.length > 0) || (user?.noAlcohol && user.noAlcohol === true)) &&
                <div>
                    <h2>Предпочитаемые напитки</h2>
                    {user.drinkPreferences && user.drinkPreferences.map((drink) => (
                        <div key={drink}>
                            🍹 {drink}
                        </div>
                    ))
                    }

                    {user.noAlcohol && user.noAlcohol === true &&
                        <p>
                            Без алкогольных напитки
                        </p>
                    }
                </div>
            }

            {user?.noSmoking && user.noSmoking === true &&
                <div>
                    🚭 Не курю
                </div>
            }

            {/* Meet (in) Preferences block */}
            {user?.meetIn && user.meetIn.length > 0 &&
                <div>
                    <h2>Готов встретиться:</h2>
                    {user.meetIn.map((place) => (
                        <div key={place}>
                            ✅ {MeetTypeLabels[place]}
                        </div>
                    ))}
                </div>
            }

            {user?.readyToTrip && user.readyToTrip === true &&
                <div>
                    ✅ Готов к поездке в другой город
                </div>
            }

            {/* Statistic block */}

            {/* Reviews block */}

            {/* Additional actions block (жалоба, блокировка/разблокировка, ) */}
            
        </section>
    )
}