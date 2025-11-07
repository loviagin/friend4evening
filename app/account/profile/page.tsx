"use client"
import { auth } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import styles from './page.module.css'
import { User } from '@/models/User';
import GeneralProfile from './components/GeneralProfile/GeneralProfile';
import EditProfile from './components/EditProfile/EditProfile';
import SettingsProfile from './components/SettingsProfile/SettingsProfile';
import Avatar from '@/components/Avatar/Avatar';

enum ProfileTab {
    general, edit, settings
}

export default function AccountProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [tab, setTab] = useState<ProfileTab>(ProfileTab.general);

    useEffect(() => {
        const fetchUser = async () => {
            console.log("uid", auth.currentUser?.uid);
            const response = await fetch(`/api/users/${auth.currentUser?.uid}`)
            const data = await response.json();
            setUser(data as User);
            console.log("data", data);
        }

        fetchUser()
    }, []);

    let content;
    switch (tab) {
        case ProfileTab.general:
            content = <GeneralProfile user={user} />
            break;
        case ProfileTab.edit:
            content = user ? <EditProfile user={user}/> : <>Загрузка...</>
            break;
        case ProfileTab.settings:
            content = <SettingsProfile user={user} />
            break;
        default:
            break;
    }

    return (
        <main className={styles.container}>
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
                        {user?.status && <span className={styles.status}>{user?.status}</span>}
                    </div>
                    <h5 className={styles.nickname}>@{user?.nickname ? user?.nickname : "Никнейм не задан"}</h5>
                    {/* Actions block */}
                    <div className={styles.actionsBlock}>
                        <button className={styles.button}>Предложить встречу</button>
                        <button className={styles.button}>Написать сообщение</button>
                        <button className={styles.buttonSecondary}>Заявка в друзья</button>
                        <button className={styles.buttonSecondary}>Ссылка на профиль</button>
                    </div>
                </div>
            </section>

            <hr className={styles.divider} />

            {/* navigation */}
            <section className={styles.navigation}>
                <button 
                    className={`${styles.navButton} ${tab === ProfileTab.general ? styles.navButtonActive : ''}`} 
                    onClick={() => setTab(ProfileTab.general)}
                >
                    Основное
                </button>
                <button 
                    className={`${styles.navButton} ${tab === ProfileTab.edit ? styles.navButtonActive : ''}`} 
                    onClick={() => setTab(ProfileTab.edit)}
                >
                    Редактировать Профиль
                </button>
                <button 
                    className={`${styles.navButton} ${tab === ProfileTab.settings ? styles.navButtonActive : ''}`} 
                    onClick={() => setTab(ProfileTab.settings)}
                >
                    Настройки
                </button>
            </section>

            {/* navigation content */}
            <section className={styles.content}>
                { content }
            </section>
        </main>
    );
}