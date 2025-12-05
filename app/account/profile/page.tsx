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
import BlockedProfile from './components/BlockedProfile/BlockedProfile';
import AdminProfile from './components/AdminProfile/AdminProfile';
import Friends from './components/Friends/Friends';
import { AiOutlineCloseCircle, AiOutlineNotification } from 'react-icons/ai';
import { subscribeUser, WebPushSubscription } from '@/app/actions';
import Link from 'next/link';
import { IoIosNotifications } from 'react-icons/io';
import { useTranslations } from 'next-intl';

enum ProfileTab {
    general, edit, settings, admin, friends
}

export default function AccountProfile() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('Profile');
    const cTab = searchParams.get('tab');
    const [user, setUser] = useState<User | null>(null);
    const [tab, setTab] = useState<ProfileTab>(ProfileTab.general);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [showSubscription, setShowSubscription] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            console.log("uid", auth.currentUser?.uid);
            const response = await fetch(`/api/users/${auth.currentUser?.uid}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            })
            const data = await response.json();
            setUser(data as User);
            console.log("data", data);
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setSubscription(subscription);
        }

        fetchUser()

        if (localStorage.getItem('hideSubscriptionOffer') === 'true') {
            setShowSubscription(false)
        } else {
            setShowSubscription(true)
        }

        if (cTab) {
            if (cTab === 'settings') {
                setTab(ProfileTab.settings);
            } else if (cTab === 'edit') {
                setTab(ProfileTab.edit);
            } else if (cTab == 'admin') {
                setTab(ProfileTab.admin);
            } else if (cTab == 'friends') {
                setTab(ProfileTab.friends);
            } else {
                setTab(ProfileTab.general);
            }

            console.log("TAB", cTab)
            router.push('#profile-content');
        }
    }, []);

    async function subscribeToPush() {
        if (!auth.currentUser) return

        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
            ),
        })
        setSubscription(sub);
        const serializedSub: WebPushSubscription = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
                p256dh: (sub as any).toJSON().keys.p256dh,
                auth: (sub as any).toJSON().keys.auth,
            },
        }
        await subscribeUser(serializedSub, auth.currentUser.uid)
    }

    const handleCloseSubscriptionOffer = () => {
        setShowSubscription(false)
        localStorage.setItem('hideSubscriptionOffer', 'true')
    }

    let content;
    switch (tab) {
        case ProfileTab.general:
            content = <GeneralProfile user={user} />
            break;
        case ProfileTab.friends:
            content = user ? <Friends user={user} /> : <>{t('loading')}</>
            break;
        case ProfileTab.edit:
            content = user ? <EditProfile user={user} /> : <>{t('loading')}</>
            break;
        case ProfileTab.settings:
            content = <SettingsProfile />
            break;
        case ProfileTab.admin:
            content = <AdminProfile />
            break;
        default:
            break;
    }

    if (user && user.blocked === true) {
        return (
            <>
                <BlockedProfile />
            </>
        )
    }

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('title')}</h1>
                <Link href={'/account/notifications'} className={styles.notificationsLink}>
                    <IoIosNotifications />
                </Link>
            </div>
            <hr className={styles.divider} />

            {showSubscription === true && subscription === null && (
                <div className={styles.subscriptionOffer}>
                    <button className={styles.closeButton} onClick={handleCloseSubscriptionOffer}>
                        <AiOutlineCloseCircle />
                    </button>
                    <div className={styles.subscriptionIcon}>
                        <AiOutlineNotification />
                    </div>
                    <div className={styles.subscriptionContent}>
                        <h4 className={styles.subscriptionTitle}>{t('subscription.title')}</h4>
                        <p className={styles.subscriptionText}>{t('subscription.text')}</p>
                    </div>
                    <button className={styles.subscriptionButton} onClick={subscribeToPush}>{t('subscription.button')}</button>
                </div>
            )}
            <HeroProfile user={user} />

            <hr className={styles.divider} />

            {/* navigation */}
            <section className={styles.navigation}>
                <button
                    className={`${styles.navButton} ${tab === ProfileTab.general ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(ProfileTab.general)}
                >
                    {t('navigation.general')}
                </button>
                <button
                    className={`${styles.navButton} ${tab === ProfileTab.friends ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(ProfileTab.friends)}
                >
                    {t('navigation.friends')}
                </button>
                {user?.tags && user.tags.includes("admin") && (
                    <button
                        className={`${styles.navButton} ${tab === ProfileTab.admin ? styles.navButtonActive : ''}`}
                        onClick={() => setTab(ProfileTab.admin)}
                    >
                        {t('navigation.admin')}
                    </button>
                )}
                <button
                    className={`${styles.navButton} ${tab === ProfileTab.edit ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(ProfileTab.edit)}
                >
                    {t('navigation.edit')}
                </button>
                <button
                    className={`${styles.navButton} ${tab === ProfileTab.settings ? styles.navButtonActive : ''}`}
                    onClick={() => setTab(ProfileTab.settings)}
                >
                    {t('navigation.settings')}
                </button>
            </section>

            {/* navigation content */}
            <section className={styles.content} id='profile-content'>
                {content}
            </section>
        </main>
    );
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}