"use client"
import { AiOutlineClose, AiOutlineStar } from 'react-icons/ai'
import styles from './MeetFullCard.module.css'
import { Meet, ApplicationMemberStatus, MeetStatus } from '@/models/Meet'
import { FaWineBottle } from 'react-icons/fa'
import { getAges } from '@/app/account/meets/components/Meets/Meets'
import { useAuth } from '@/app/_providers/AuthProvider'
import Link from 'next/link'
import { useState } from 'react'
import { sendInvitationResponseNotification } from '@/app/actions'
import { useTranslations, useLocale } from 'next-intl'

export default function MeetFullCard({ meet }: { meet: Meet }) {
    const auth = useAuth();
    const t = useTranslations('MeetFullCard');
    const tMeets = useTranslations('Meets');
    const locale = useLocale();
    const [loading, setLoading] = useState(false);

    const ages = getAges((key: string) => {
        const keyWithoutPrefix = key.replace(/^Meets\./, '');
        return tMeets(keyWithoutPrefix);
    });

    // Проверяем, является ли текущий пользователь участником
    const currentUserId = auth.user?.uid;
    const userMember = currentUserId ? meet.members.find(m => m.userId === currentUserId) : null;
    const isInvited = userMember?.status === ApplicationMemberStatus.invited;
    const isWaiting = userMember?.status === ApplicationMemberStatus.waiting;
    const isApproved = userMember?.status === ApplicationMemberStatus.approved;
    const isOwner = auth.user && auth.user.uid === meet.ownerId;

    const handleJoinOrLeave = async () => {
        if (!auth.user) return;

        setLoading(true);
        try {
            if (isInvited) {
                // Принять приглашение (статус invited -> approved)
                const response = await fetch(`/api/meets/one/${meet.id}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                    body: JSON.stringify({ userId: auth.user.uid }),
                });

                if (response.status === 200) {
                    // Отправляем уведомление организатору
                    try {
                        await sendInvitationResponseNotification('accepted', auth.user.uid, meet);
                    } catch (error) {
                        console.error('Error sending invitation accepted notification:', error);
                    }
                    window.location.reload();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    alert(errorData.message || t('errors.acceptInvitation'));
                    setLoading(false);
                }
            } else if (isApproved && userMember) {
                // Покинуть встречу
                const response = await fetch(`/api/meets/one/${meet.id}/member/${userMember.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                    body: JSON.stringify({ action: 'remove' }),
                });

                if (response.status === 200) {
                    window.location.reload();
                } else {
                    alert(t('errors.leaveMeet'));
                    setLoading(false);
                }
            } else {
                // Присоединиться к встрече
                const response = await fetch(`/api/meets/one/${meet.id}/join`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                    body: JSON.stringify({ userId: auth.user.uid }),
                });

                if (response.status === 200) {
                    window.location.reload();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    alert(errorData.message || t('errors.joinMeet'));
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Error joining/leaving meet:', error);
            alert(t('errors.action'));
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        if (!auth.user || !userMember) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/meets/one/${meet.id}/member/${userMember.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ action: 'decline' }),
            });

            if (response.status === 200) {
                // Отправляем уведомление организатору
                try {
                    await sendInvitationResponseNotification('declined', auth.user.uid, meet);
                } catch (error) {
                    console.error('Error sending invitation declined notification:', error);
                }
                window.location.reload();
            } else {
                alert(t('errors.declineInvitation'));
                setLoading(false);
            }
        } catch (error) {
            console.error('Error declining invitation:', error);
            alert(t('errors.declineInvitation'));
            setLoading(false);
        }
    };

    const handleCancelApplication = async () => {
        if (!auth.user || !userMember) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/meets/one/${meet.id}/member/${userMember.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
                body: JSON.stringify({ action: 'remove' }),
            });

            if (response.status === 200) {
                window.location.reload();
            } else {
                alert(t('errors.cancelApplication'));
                setLoading(false);
            }
        } catch (error) {
            console.error('Error canceling application:', error);
            alert(t('errors.cancelApplication'));
            setLoading(false);
        }
    };

    return (
        <div className={`keen-slider__slide ${styles.slide}`}>
            <div className={styles.slideCard}>
                <div className={styles.slideHeader}>
                    <div className={styles.starIcon}>
                        <AiOutlineStar />
                    </div>
                    <div className={styles.slideTitleRow}>
                        {isOwner ? (
                            <h3 className={styles.slideTitle}>{meet.title}</h3>
                        ) : (
                            <Link href={`/account/meets/${meet.id}`} target='_blank'><h3 className={styles.slideTitle}>{meet.title}</h3></Link>
                        )}

                        {meet.status === MeetStatus.current ? (
                            <span className={styles.currentBadge}>{t('currentBadge')}</span>
                        ) : (
                            <span className={styles.slideDate}>
                                {new Date(meet.date).toLocaleDateString(
                                    locale === 'ru' ? 'ru-RU' : 'en-US',
                                    { day: '2-digit', month: '2-digit', year: 'numeric' }
                                )}
                            </span>
                        )}
                    </div>
                </div>
                {meet.description !== null && meet.description && (
                    <p className={styles.slideDescription}>{meet.description}</p>
                )}
                <div className={styles.slideInfo}>
                    {meet.location && (
                        <div className={styles.slideInfoItem}>
                            <span>🌆</span>
                            <span>{meet.location}</span>
                            {meet.noAlcohol === true && (
                                <span className={styles.noAlcoholIcon} title={t('noAlcohol')}>
                                    <FaWineBottle />
                                    <AiOutlineClose className={styles.noAlcoholCross} />
                                </span>
                            )}
                        </div>
                    )}
                    <div className={styles.slideInfoItem}>
                        {ages.findLast((a) => a.key === meet.ageRange)?.label && (
                            <span>{ages.findLast((a) => a.key === meet.ageRange)?.label} {t('years')}</span>
                        )}
                        {meet.duration !== null && <span> • {meet.duration}</span>}
                        {meet.membersCount !== null && <span> • {t('upToMembers', { count: meet.membersCount })}</span>}
                        {meet.meetType !== null && <span> • {t(`meetTypes.${meet.meetType}`)}</span>}
                    </div>
                </div>
                {auth.user && !isOwner && (
                    <div className={styles.actionButtonContainer}>
                        {isInvited ? (
                            <div className={styles.invitedButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.joinButton}`}
                                    onClick={handleJoinOrLeave}
                                    disabled={loading}
                                >
                                    {loading ? t('loading') : t('buttons.acceptInvitation')}
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.declineButton}`}
                                    onClick={handleDecline}
                                    disabled={loading}
                                >
                                    {loading ? t('loading') : t('buttons.decline')}
                                </button>
                            </div>
                        ) : isWaiting ? (
                            <div className={styles.waitingButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.waitingButton}`}
                                    disabled={true}
                                >
                                    {t('buttons.waitingApproval')}
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.cancelButton}`}
                                    onClick={handleCancelApplication}
                                    disabled={loading}
                                >
                                    {loading ? t('loading') : t('buttons.cancelApplication')}
                                </button>
                            </div>
                        ) : (
                            <button
                                className={`${styles.actionButton} ${
                                    isApproved 
                                        ? styles.leaveButton 
                                        : styles.joinButton
                                }`}
                                onClick={handleJoinOrLeave}
                                disabled={loading}
                            >
                                {loading 
                                    ? t('loading') 
                                    : isApproved 
                                        ? t('buttons.leave') 
                                        : t('buttons.join')
                                }
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}