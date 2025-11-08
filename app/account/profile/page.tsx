"use client"
import { auth } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'
import { User } from '@/models/User';
import GeneralProfile from './components/GeneralProfile/GeneralProfile';
import EditProfile from './components/EditProfile/EditProfile';
import SettingsProfile from './components/SettingsProfile/SettingsProfile';
import { useSearchParams } from 'next/navigation';
import HeroProfile from './components/HeroProfile/HeroProfile';

enum ProfileTab {
    general, edit, settings
}

export default function AccountProfile() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const cTab = searchParams.get('tab');
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
        if (cTab) {
            if (cTab === 'settings') {
                setTab(ProfileTab.settings);
            } else if (cTab === 'edit') {
                setTab(ProfileTab.edit);
            } else {
                setTab(ProfileTab.general);
            }

            router.push('#profile-content');
        }
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
            <HeroProfile user={user} />

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
            <section className={styles.content} id='profile-content'>
                { content }
            </section>
        </main>
    );
}