import { AiOutlineClose, AiOutlineStar } from 'react-icons/ai'
import styles from './MeetFullCard.module.css'
import { Meet } from '@/models/Meet'
import { FaWineBottle } from 'react-icons/fa'
import { ages } from '@/app/account/meets/components/Meets/Meets'
import { MeetType, MeetTypeLabels } from '@/models/User'
import { useAuth } from '@/app/_providers/AuthProvider'
import Link from 'next/link'

export default function MeetFullCard({ meet }: { meet: Meet }) {
    const auth = useAuth();

    return (
        <div className={`keen-slider__slide ${styles.slide}`}>
            <div className={styles.slideCard}>
                <div className={styles.slideHeader}>
                    <div className={styles.starIcon}>
                        <AiOutlineStar />
                    </div>
                    <div className={styles.slideTitleRow}>
                        {auth.user && auth.user.uid === meet.ownerId ? (
                            <h3 className={styles.slideTitle}>{meet.title}</h3>
                        ) : (
                            <Link href={`/account/meets/${meet.id}`} target='_blank'><h3 className={styles.slideTitle}>{meet.title}</h3></Link>
                        )}

                        <span className={styles.slideDate}>{new Date(meet.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
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
            </div>
        </div>
    )
}