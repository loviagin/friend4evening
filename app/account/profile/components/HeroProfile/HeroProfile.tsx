"use client"
import Avatar from '@/components/Avatar/Avatar';
import styles from './HeroProfile.module.css';
import { User } from '@/models/User';
import { useAuth } from '@/app/_providers/AuthProvider';

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
                        {user?.tag && <span className={styles.tag}>{user?.tag}</span>}
                    </div>
                    <h5 className={styles.nickname}>@{user?.nickname ? user?.nickname : "Никнейм не задан"}{userAge()}</h5>
                    {/* Actions block */}
                    <div className={styles.actionsBlock}>
                        {auth.user?.uid !== user?.id &&
                            <>
                                <button className={styles.button}>Предложить встречу</button>
                                <button className={styles.button}>Написать сообщение</button>
                                <button className={styles.buttonSecondary}>Заявка в друзья</button>
                            </>
                        }
                        <button className={styles.buttonSecondary}>Поделиться профилем</button>
                    </div>
                </div>
            </section>
        </section>
    )
}