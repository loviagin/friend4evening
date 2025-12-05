"use client"
import Avatar from '@/components/Avatar/Avatar';
import styles from './HeroProfile.module.css';
import { User } from '@/models/User';
import { useAuth } from '@/app/_providers/AuthProvider';
import ShareProfile from './components/ShareProfile/ShareProfile';
import Dropdown from '@/components/Dropdown/Dropdown';
import { sendNotificationToUser } from '@/app/actions';
import { useEffect, useState } from 'react';
import { NotificationDTO } from '@/app/api/notifications/[userId]/route';
import { useTranslations } from 'next-intl';

type HeroProps = {
    user: User | null,
}

enum FriendType {
    none, waiting, friends
}

export default function HeroProfile({ user }: HeroProps) {
    const auth = useAuth();
    const tTags = useTranslations('UserTags');
    const t = useTranslations('HeroProfile');
    const [isFriends, setIsFriends] = useState<FriendType>(FriendType.none);
    const [status, setStatus] = useState<string>('none');
    
    const tags = [
        { key: "READY", label: tTags('READY') },
        { key: "CURRENT", label: tTags('CURRENT') },
        { key: "BUSY", label: tTags('BUSY') },
        { key: "INTENSIVE_SEARCH", label: tTags('INTENSIVE_SEARCH') }
    ];

    useEffect(() => {
        const fetchFriends = async (uid: string, userId: string) => {
            const r = await fetch(`/api/users/${uid}/friend/check`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ userId: userId })
            })

            if (r.status === 404) {
                setIsFriends(FriendType.none)
                console.log("NONE")
            } else if (r.status === 200) {
                setIsFriends(FriendType.friends)
                console.log("FRIENDS")
            } else if (r.status === 409) {
                setIsFriends(FriendType.waiting)
                console.log("WAITING")
            }
        }

        if (user && auth.user && user.friends && user.friends.includes(auth.user.uid)) {
            setIsFriends(FriendType.friends)

            setStatus(user?.tag ?? 'none')
            console.log("TAG", user?.tag)
        } else if (user && auth.user) {
            fetchFriends(auth.user.uid, user.id)

            setStatus(user?.tag ?? 'none')
            console.log("TAG", user?.tag)
        }
    }, [auth, user])

    const pluralizeYears = (age: number) => {
        const mod10 = age % 10;
        const mod100 = age % 100;

        if (mod100 >= 11 && mod100 <= 14) return t('years.many');
        if (mod10 === 1) return t('years.one');
        if (mod10 >= 2 && mod10 <= 4) return t('years.few');
        return t('years.many');
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
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ userId: user.id })
        })
        const data = await response.json();
        if (response.status === 409) {
            setIsFriends(FriendType.waiting)
            alert(t('alerts.requestAlreadySent'))
        } else if (response.status === 202) {
            alert(t('alerts.becameFriends'))
            setIsFriends(FriendType.friends)
            sendNotificationTo(user.id, t('notifications.friendRequestApproved'))
            sendNotification(t('notifications.newFriendTitle'), t('notifications.newFriendDescription'), "friends")
        } else if (response.status === 200) {
            alert(t('alerts.requestSent'))
            sendNotificationTo(user.id, t('notifications.friendRequestSent'))
            sendNotification(t('notifications.newFriendRequestTitle'), t('notifications.newFriendRequestDescription'), "friend-request")
        } else {
            setIsFriends(FriendType.none)
            alert(t('alerts.requestError'))
        }
    }

    const sendNotification = async (title: string, description: string, type: string) => {
        if (!auth.user) return
        const data: NotificationDTO = {
            type,
            title,
            description,
            senderId: auth.user?.uid
        }

        const r = await fetch(`/api/notifications/${user?.id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify(data)
        })
    }

    const handleFriendDelete = async () => {
        if (!user || !auth.user) return

        if (window.confirm(t('alerts.unfriendConfirm'))) {
            setIsFriends(FriendType.none)

            const response = await fetch(`/api/users/${auth.user.uid}/unfriend`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ userId: user.id })
            })

            const data = await response.json();
            if (response.status !== 200) {
                setIsFriends(FriendType.friends)
                alert(t('alerts.unfriendError'))
            }
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
        setStatus(tag);
        const resp = await fetch(`/api/users/${user?.id}/tags`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ tag })
        })

        if (resp.status !== 200) {
            const data = await resp.json()

            setStatus('none')
            alert(t('alerts.tagError'))
        }
    }

    return (
        <section>
            {/* hero */}
            <section className={styles.hero}>
                {/* left block */}
                <div className={styles.avatarBlock}>
                    <Avatar avatarUrl={user?.avatarUrl} />
                </div>
                {/* right block */}
                <div className={styles.infoBlock}>
                    <div className={styles.nameBlock}>
                        <h3>{user?.name && user.name.length !== 0 ? user?.name : t('placeholders.name')}</h3>
                        {user?.tags && user.tags.includes("verified") && (
                            <img src={'/verified.webp'} className={styles.verifiedBadge} alt="Verified" />
                        )}
                        {user && auth.user && user.id === auth.user.uid ? (
                            <Dropdown
                                source={tags}
                                current={status}
                                onChange={handleTagChange}
                            />
                        ) : (
                            <>
                                {user?.tag && <span className={styles.tag}>{tags.find(s => s.key === user.tag)?.label}</span>}
                            </>
                        )}

                    </div>
                    <div className={styles.nicknameBlock}>
                        <h5 className={styles.nickname}>@{user?.nickname ? user?.nickname : t('placeholders.nickname')}{userAge()}</h5>
                    </div>
                    {/* Actions block */}
                    <div className={styles.actionsBlock}>
                        {auth.user && user && auth.user?.uid !== user?.id &&
                            <>
                                <button className={styles.button}>{t('buttons.suggestMeet')}</button>
                                <button className={styles.button}>{t('buttons.sendMessage')}</button>
                                {isFriends === FriendType.friends ? (
                                    <button className={styles.buttonSecondary} onClick={handleFriendDelete}>{t('buttons.friends')}</button>
                                ) : (isFriends === FriendType.waiting ? (
                                    <button className={styles.buttonSecondary}>{t('buttons.requestSent')}</button>
                                ) : (
                                    <button className={styles.buttonSecondary} onClick={handleFriendAppend}>{t('buttons.addFriend')}</button>
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