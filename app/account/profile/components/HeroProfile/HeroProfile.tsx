"use client"
import Avatar from '@/components/Avatar/Avatar';
import styles from './HeroProfile.module.css';
import { User } from '@/models/User';
import { useAuth } from '@/app/_providers/AuthProvider';
import ShareProfile from './components/ShareProfile/ShareProfile';
import Link from 'next/link';

type HeroProps = {
    user: User | null,
}

export default function HeroProfile({ user }: HeroProps) {
    const auth = useAuth();

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
        const response = await fetch(`/api/users/${auth.user.uid}/friend`, {
            method: "POST",
            body: JSON.stringify({ userId: user.id })
        })
        const data = await response.json();
        if (response.status === 409) {
            alert("Заявка уже отправлена. Дождитесь ответа")
        } else if (response.status === 200) {
            alert("Заявка успешно отправлена")
        } else {
            alert("Ошибка отправки заявки в друзья")
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
                        {user?.tag && <span className={styles.tag}>{user?.tag}</span>}
                    </div>
                    <div className={styles.nicknameBlock}>
                        <h5 className={styles.nickname}>@{user?.nickname ? user?.nickname : "Никнейм не задан"}{userAge()}</h5>
                        {!user?.nickname && auth.user?.uid === user?.id && (
                            <a href={'/account/profile?tab=edit#nickname'} className={styles.setNicknameLink}>
                                Задать никнейм
                            </a>
                        )}
                    </div>
                    {/* Actions block */}
                    <div className={styles.actionsBlock}>
                        {auth.user && user && auth.user?.uid !== user?.id &&
                            <>
                                <button className={styles.button}>Предложить встречу</button>
                                <button className={styles.button}>Написать сообщение</button>
                                {user.friends && user.friends.includes(auth.user?.uid) ? (
                                    <button className={styles.buttonSecondary}>Вы друзья</button>
                                ) : (
                                    <button className={styles.buttonSecondary} onClick={handleFriendAppend}>Заявка в друзья</button>
                                )}
                            </>
                        }

                        {user?.nickname && (
                            <ShareProfile userNickname={user?.nickname} />
                        )}
                    </div>
                </div>
            </section>
        </section>
    )
}