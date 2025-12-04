"use client"
import { AiOutlineClose, AiOutlineStar } from 'react-icons/ai'
import styles from './MeetFullCard.module.css'
import { Meet, ApplicationMemberStatus, MeetStatus } from '@/models/Meet'
import { FaWineBottle } from 'react-icons/fa'
import { ages } from '@/app/account/meets/components/Meets/Meets'
import { MeetType, MeetTypeLabels } from '@/models/User'
import { useAuth } from '@/app/_providers/AuthProvider'
import Link from 'next/link'
import { useState } from 'react'
import { sendInvitationResponseNotification } from '@/app/actions'

export default function MeetFullCard({ meet }: { meet: Meet }) {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);

    // Проверяем, является ли текущий пользователь участником
    const currentUserId = auth.user?.uid;
    const userMember = currentUserId ? meet.members.find(m => m.userId === currentUserId) : null;
    const isMember = userMember !== null && userMember !== undefined;
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
                    alert(errorData.message || 'Ошибка при принятии приглашения');
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
                    alert('Ошибка при покидании встречи');
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
                    alert(errorData.message || 'Ошибка при присоединении к встрече');
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Error joining/leaving meet:', error);
            alert('Ошибка при выполнении действия');
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
                alert('Ошибка при отклонении приглашения');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error declining invitation:', error);
            alert('Ошибка при отклонении приглашения');
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
                alert('Ошибка при отмене заявки');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error canceling application:', error);
            alert('Ошибка при отмене заявки');
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
                            <span className={styles.currentBadge}>Сейчас идет</span>
                        ) : (
                            <span className={styles.slideDate}>{new Date(meet.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
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
                                <span className={styles.noAlcoholIcon} title="Не употребляю алкоголь">
                                    <FaWineBottle />
                                    <AiOutlineClose className={styles.noAlcoholCross} />
                                </span>
                            )}
                        </div>
                    )}
                    <div className={styles.slideInfoItem}>
                        {ages.findLast((a) => a.key === meet.ageRange)?.label && (
                            <span>{ages.findLast((a) => a.key === meet.ageRange)?.label} лет</span>
                        )}
                        {meet.duration !== null && <span> • {meet.duration}</span>}
                        {meet.membersCount !== null && <span> • До {meet.membersCount} человек</span>}
                        {meet.meetType !== null && <span> • {MeetTypeLabels[meet.meetType as MeetType]}</span>}
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
                                    {loading ? 'Загрузка...' : 'Принять приглашение'}
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.declineButton}`}
                                    onClick={handleDecline}
                                    disabled={loading}
                                >
                                    {loading ? 'Загрузка...' : 'Отклонить'}
                                </button>
                            </div>
                        ) : isWaiting ? (
                            <div className={styles.waitingButtons}>
                                <button
                                    className={`${styles.actionButton} ${styles.waitingButton}`}
                                    disabled={true}
                                >
                                    Ожидает одобрения
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.cancelButton}`}
                                    onClick={handleCancelApplication}
                                    disabled={loading}
                                >
                                    {loading ? 'Загрузка...' : 'Отменить заявку'}
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
                                    ? 'Загрузка...' 
                                    : isApproved 
                                        ? 'Покинуть' 
                                        : 'Присоединиться'
                                }
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}