"use client";

import { User } from "@/models/User";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";
import styles from './UserCard.module.css'
import { AiFillCar, AiOutlineClose } from "react-icons/ai";
import { FaSmokingBan, FaWineBottle } from "react-icons/fa";
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { useAuth } from '@/app/_providers/AuthProvider';
import InviteToMeet from '../InviteToMeet/InviteToMeet';

export default function UserCard({ user }: { user: User }) {
    const t = useTranslations('UserCard');
    const locale = useLocale();
    const auth = useAuth();
    const [showInviteModal, setShowInviteModal] = useState(false);

    const pluralizeYears = (age: number) => {
        if (locale === 'ru') {
            const mod10 = age % 10;
            const mod100 = age % 100;

            if (mod100 >= 11 && mod100 <= 14) return t('years.many');
            if (mod10 === 1) return t('years.one');
            if (mod10 >= 2 && mod10 <= 4) return t('years.few');
            return t('years.many');
        } else {
            // English: simple pluralization
            return age === 1 ? t('years.one') : t('years.other');
        }
    };

    const userAge = (user: User) => {
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
        <div key={user.id} className={styles.userCard}>
            <Link href={`/profile/${user.nickname}`} target="_blank">
                <div className={styles.userHeader}>
                    <div className={styles.userAvatarWrapper}>
                        <Avatar avatarUrl={user.avatarUrl} />
                        {user.tag && (
                            <span className={styles.userTag}>{t(`tags.${user.tag}`)}</span>
                        )}
                    </div>
                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user.name}
                            {userAge(user)}
                        </div>
                        {(user.location?.city || user.readyToTrip === true || user.noAlcohol === true || user.noSmoking === true) && (
                            <div className={styles.userLocation}>
                                {user.location?.city && (
                                    <>🌆 {user.location.city}</>
                                )}
                                {user.readyToTrip === true && (
                                    <span className={styles.carIcon} title={t('readyToTrip')}>
                                        <AiFillCar />
                                    </span>
                                )}
                                {user.noAlcohol === true && (
                                    <span className={styles.noAlcoholIcon} title={t('noAlcohol')}>
                                        <FaWineBottle />
                                        <AiOutlineClose className={styles.noAlcoholCross} />
                                    </span>
                                )}
                                {user.noSmoking === true && (
                                    <span className={styles.noSmokingIcon} title={t('noSmoking')}>
                                        <FaSmokingBan />
                                    </span>
                                )}
                            </div>
                        )}
                        <div className={styles.userNickname}>
                            @{user.nickname}
                        </div>
                    </div>
                </div>
                {user.bio && (
                    <p className={styles.userBio}>
                        {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
                    </p>
                )}
            </Link>
            {auth.user && auth.user.uid !== user.id && (
                <button
                    className={styles.inviteButton}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowInviteModal(true);
                    }}
                >
                    {t('buttons.invite')}
                </button>
            )}
            {showInviteModal && (
                <InviteToMeet user={user} close={() => setShowInviteModal(false)} />
            )}
        </div>
    )
}