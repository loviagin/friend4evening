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
                    <h5 className={styles.nickname}>@{user?.nickname ? user?.nickname : "Никнейм не задан"} • { user?.status['online'] !== undefined ? "Онлайн" : "Не в сети" }</h5>
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