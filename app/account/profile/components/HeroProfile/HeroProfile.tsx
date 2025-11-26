"use client"
import Avatar from '@/components/Avatar/Avatar';
import styles from './HeroProfile.module.css';
import { tags, User } from '@/models/User';
import { useAuth } from '@/app/_providers/AuthProvider';
import ShareProfile from './components/ShareProfile/ShareProfile';
import Dropdown from '@/components/Dropdown/Dropdown';
import { sendNotificationToUser } from '@/app/actions';
import { useEffect, useState } from 'react';

type HeroProps = {
    user: User | null,
}

enum FriendType {
    none, waiting, friends
}

export default function HeroProfile({ user }: HeroProps) {
    const auth = useAuth();
    const [isFriends, setIsFriends] = useState<FriendType>(FriendType.none);

    useEffect(() => {
        const fetchFriends = async (uid: string, userId: string) => {
            const r = await fetch(`/api/users/${uid}/friend/check`, {
                method: 'POST',
                body: JSON.stringify({ userId: userId })
            })

            if (r.status === 404) {
                setIsFriends(FriendType.none)
            } else if (r.status === 200) {
                setIsFriends(FriendType.friends)
            } else if (r.status === 409) {
                setIsFriends(FriendType.waiting)
            }
        }

        if (user && auth.user && user.friends && user.friends.includes(auth.user.uid)) {
            setIsFriends(FriendType.friends)
        } else if (user && auth.user) {
            fetchFriends(auth.user.uid, user.id)
        }
    }, [auth])

    const pluralizeYears = (age: number) => {
        const mod10 = age % 10;
        const mod100 = age % 100;

        if (mod100 >= 11 && mod100 <= 14) return "лет";
        if (mod10 === 1) return "год";
        if (mod10 >= 2 && mod10 <= 4) return "года";
        return "лет";
    };

    const userAge = () => {
        if (user?.showBirthday && user.birthday) {
            const birthday = new Date(user.birthday);
            if (isNaN(birthday.getTime())) return;

            const today = new Date();
            let age = today.getFullYear() - birthday.getFullYear();
            const m = today.getMonth() - birthday.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
                age--;
            }

            return ` • ${age} ${pluralizeYears(age)}`;
        }
    };

    const handleFriendAppend = async () => {
        if (!user || !auth.user) return
        setIsFriends(FriendType.waiting)
        const response = await fetch(`/api/users/${auth.user.uid}/friend`, {
            method: "POST",
            body: JSON.stringify({ userId: user.id })
        })
        const data = await response.json();
        if (response.status === 409) {
            setIsFriends(FriendType.waiting)
            alert("Заявка уже отправлена. Дождитесь ответа")
        } else if (response.status === 202) {
            alert("Вы стали друзьями!")
            setIsFriends(FriendType.friends)
            sendNotificationTo(user.id, "Подтверждена заявка на дружбу")
        } else if (response.status === 200) {
            alert("Заявка успешно отправлена")
            sendNotificationTo(user.id, "У вас новая заявка в друзья")
        } else {
            setIsFriends(FriendType.none)
            alert("Ошибка отправки заявки в друзья")
        }
    }

    async function sendNotificationTo(userId: string, message: string) {
        if (!auth.user) {
            console.log("AUTH USER IS NULL")
            return
        }
        console.log("SENDING>>>")
        await sendNotificationToUser(userId, message)
    }

    const handleTagChange = async (tag: string) => {
        const resp = await fetch(`/api/users/${user?.id}/tags`, {
            method: "POST",
            body: JSON.stringify({ tag })
        })
        const data = await resp.json()

        if (resp.status === 200) {
            window.location.reload();
        }
    }

    return (
        <section>
            <h1 className={styles.title}>Профиль</h1>
            <hr className={styles.divider} />
            {/* hero */}
            <section className={styles.hero}>
                {/* left block */}
                <div className={styles.avatarBlock}>
                    <Avatar avatarUrl={user?.avatarUrl} />
                </div>
                {/* right block */}
                <div className={styles.infoBlock}>
                    <div className={styles.nameBlock}>
                        <h3>{user?.name.length !== 0 ? user?.name : "Имя не задано"}</h3>
                        {user?.tags && user.tags.includes("verified") && (
                            <img src={'/verified.webp'} className={styles.verifiedBadge} alt="Verified" />
                        )}
                        {user && auth.user && user.id === auth.user.uid ? (
                            <Dropdown
                                source={tags}
                                current={user.tag ?? "Установить статус"}
                                onChange={handleTagChange}
                            />
                        ) : (
                            <>
                                {user?.tag && <span className={styles.tag}>{tags.find(s => s.key === user.tag)?.label}</span>}
                            </>
                        )}

                    </div>
                    <div className={styles.nicknameBlock}>
                        <h5 className={styles.nickname}>@{user?.nickname ? user?.nickname : "Никнейм не задан"}{userAge()}</h5>
                        {/* {!user?.nickname && auth.user?.uid === user?.id && (
                            <a href={'/account/profile?tab=edit#nickname'} className={styles.setNicknameLink}>
                                Задать никнейм
                            </a>
                        )} */}
                    </div>
                    {/* Actions block */}
                    <div className={styles.actionsBlock}>
                        {auth.user && user && auth.user?.uid !== user?.id &&
                            <>
                                <button className={styles.button}>Предложить встречу</button>
                                <button className={styles.button}>Написать сообщение</button>
                                {isFriends === FriendType.friends ? (
                                    <button className={styles.buttonSecondary}>Вы друзья</button>
                                ) : (isFriends === FriendType.waiting ? (
                                    <button className={styles.buttonSecondary}>Заявка отправлена</button>
                                ) : (
                                    <button className={styles.buttonSecondary} onClick={handleFriendAppend}>Заявка в друзья</button>
                                ))}
                            </>
                        }

                        {user?.nickname && (
                            <ShareProfile userNickname={user?.nickname} />
                        )}
                    </div>
                </div>
            </section>
        </section >
    )
}