import styles from './MeetCompleted.module.css'

export type Participant = {
    userId: string,
    name: string,
    nickname: string,
    avatarUrl: string,
}

export type MeetCompletedEmail = {
    userName: string,
    meetId: string,
    meetTitle: string,
    meetDate: Date,
    meetLocation: string | null,
    meetDescription: string | null,
    participants: Participant[],
    currentUserId: string,
}

function getAvatarUrl(avatarUrl: string | undefined, base: string): string {
    if (!avatarUrl) {
        return `${base}/user.webp`;
    }

    // Проверяем, является ли это одним из стандартных аватаров
    const standardAvatars = ['avatar1', 'avatar2', 'avatar3', 'avatar4'];
    if (standardAvatars.includes(avatarUrl)) {
        return `${base}/avatars/${avatarUrl}.png`;
    }

    // Иначе это внешний URL
    return avatarUrl;
}

export function MeetCompleted({ userName, meetId, meetTitle, meetDate, meetLocation, meetDescription, participants, currentUserId }: MeetCompletedEmail) {
    const base = process.env.NEXT_PUBLIC_URL!

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Фильтруем участников, исключая текущего пользователя
    const otherParticipants = participants.filter(p => p.userId !== currentUserId);

    return (
        <html>
            <head>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .${styles.emailBody} {
                        font-family: 'Nunito', Arial, Helvetica, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 0;
                        color: #000000;
                        line-height: 1.6;
                    }
                    .${styles.container} {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .${styles.emailHeader} {
                        background: linear-gradient(135deg, #466C95 0%, #5DAE8B 100%);
                        padding: 2rem;
                        text-align: center;
                    }
                    .${styles.logo} {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.75rem;
                        color: #ffffff !important;
                        font-size: 1.5rem;
                        font-weight: 700;
                        text-decoration: none;
                    }
                    .${styles.favicon} {
                        width: 32px;
                        height: 32px;
                        vertical-align: middle;
                    }
                    .${styles.title} {
                        font-size: 1.75rem;
                        font-weight: 700;
                        color: #5DAE8B;
                        margin: 2rem 2rem 1rem;
                        text-align: center;
                        line-height: 1.4;
                    }
                    .${styles.divider} {
                        border: none;
                        border-top: 2px solid rgba(93, 174, 139, 0.3);
                        margin: 2rem auto;
                        max-width: 600px;
                    }
                    .${styles.paragraph} {
                        font-size: 1.125rem;
                        color: #000000;
                        margin: 1.5rem 2rem;
                        text-align: center;
                        opacity: 0.9;
                    }
                    .${styles.successBox} {
                        background: rgba(93, 174, 139, 0.1);
                        border: 2px solid #5DAE8B;
                        border-radius: 15px;
                        padding: 1.5rem;
                        margin: 1.5rem 2rem;
                    }
                    .${styles.successTitle} {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #5DAE8B;
                        margin: 0 0 1rem 0;
                        text-align: center;
                    }
                    .${styles.meetInfo} {
                        background: linear-gradient(135deg, rgba(70, 108, 149, 0.05) 0%, rgba(93, 174, 139, 0.05) 100%);
                        border: 2px solid rgba(70, 108, 149, 0.2);
                        border-radius: 15px;
                        padding: 1.5rem;
                        margin: 1.5rem 2rem;
                    }
                    .${styles.meetTitle} {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #466C95;
                        margin: 0 0 1rem 0;
                        text-align: center;
                    }
                    .${styles.meetDetail} {
                        display: flex;
                        align-items: flex-start;
                        gap: 0.75rem;
                        margin: 1rem 0;
                        font-size: 1rem;
                        color: #000000;
                    }
                    .${styles.meetDetailIcon} {
                        font-size: 1.25rem;
                        color: #466C95;
                        flex-shrink: 0;
                        margin-top: 0.125rem;
                    }
                    .${styles.meetDetailText} {
                        flex: 1;
                        line-height: 1.5;
                    }
                    .${styles.meetDetailLabel} {
                        font-weight: 600;
                        color: #466C95;
                        margin-right: 0.5rem;
                    }
                    .${styles.participantsSection} {
                        margin: 2rem 2rem;
                    }
                    .${styles.participantsTitle} {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #466C95;
                        margin-bottom: 1.5rem;
                        text-align: center;
                    }
                    .${styles.participantsList} {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .${styles.participantCard} {
                        background: linear-gradient(135deg, rgba(70, 108, 149, 0.05) 0%, rgba(93, 174, 139, 0.05) 100%);
                        border: 2px solid rgba(70, 108, 149, 0.2);
                        border-radius: 15px;
                        padding: 1.5rem;
                        display: flex;
                        align-items: center;
                        gap: 1.5rem;
                    }
                    .${styles.participantAvatar} {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        object-fit: cover;
                        flex-shrink: 0;
                        border: 2px solid rgba(70, 108, 149, 0.2);
                    }
                    .${styles.participantInfo} {
                        flex: 1;
                        min-width: 0;
                    }
                    .${styles.participantName} {
                        font-size: 1.125rem;
                        font-weight: 600;
                        color: #466C95;
                        margin: 0 0 0.25rem 0;
                        word-wrap: break-word;
                    }
                    .${styles.participantNickname} {
                        font-size: 0.9375rem;
                        color: #000000;
                        opacity: 0.7;
                        margin: 0;
                        word-wrap: break-word;
                    }
                    .${styles.reviewButton} {
                        display: inline-block;
                        padding: 0.75rem 1.5rem;
                        font-size: 0.9375rem;
                        font-weight: 600;
                        text-decoration: none;
                        border-radius: 50px;
                        text-align: center;
                        transition: all 0.3s ease;
                        background: linear-gradient(135deg, #466C95 0%, #5DAE8B 100%);
                        color: #ffffff !important;
                        border: none;
                        white-space: nowrap;
                        flex-shrink: 0;
                    }
                    .${styles.reviewButton}:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(70, 108, 149, 0.3);
                    }
                    .${styles.buttonContainer} {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 2rem auto;
                        max-width: 500px;
                        padding: 0 2rem;
                    }
                    .${styles.button} {
                        display: inline-block;
                        padding: 0.875rem 2rem;
                        font-size: 1rem;
                        font-weight: 600;
                        text-decoration: none;
                        border-radius: 50px;
                        text-align: center;
                        transition: all 0.3s ease;
                        background: linear-gradient(135deg, #466C95 0%, #5DAE8B 100%);
                        color: #ffffff !important;
                        border: none;
                    }
                    .${styles.button}:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(70, 108, 149, 0.3);
                    }
                    .${styles.emailFooter} {
                        background-color: #ffffff;
                        padding: 2rem;
                        text-align: center;
                        border-top: 2px solid rgba(70, 108, 149, 0.1);
                        margin-top: 3rem;
                        font-size: 0.875rem;
                        color: #000000;
                        opacity: 0.7;
                    }
                    .${styles.footerLink} {
                        display: block;
                        margin-top: 0.5rem;
                        color: #466C95;
                        text-decoration: none;
                    }
                    .${styles.infoText} {
                        font-size: 0.9375rem;
                        color: #000000;
                        margin: 1.5rem 2rem;
                        text-align: center;
                        opacity: 0.7;
                        font-style: italic;
                    }
                `}} />
            </head>
            <body className={styles.emailBody}>
                <div className={styles.container}>
                    <header className={styles.emailHeader}>
                        <a href={`${base}`} className={styles.logo}>
                            <img className={styles.favicon} src={`${base}/icon.png`} alt="Friends4Evening" />
                            Friends4Evening
                        </a>
                    </header>

                    <h1 className={styles.title}>
                        Встреча завершена
                    </h1>
                    <hr className={styles.divider} />
                    <p className={styles.paragraph}>
                        Привет, {userName}!<br />
                        Ваша встреча завершена. Надеемся, вы хорошо провели время!
                    </p>

                    <div className={styles.successBox}>
                        <h2 className={styles.successTitle}>✨ Встреча завершена</h2>
                        <p className={styles.paragraph} style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                            Не забудьте оставить отзывы о других участниках встречи
                        </p>
                    </div>

                    <div className={styles.meetInfo}>
                        <h2 className={styles.meetTitle}>{meetTitle}</h2>

                        <div className={styles.meetDetail}>
                            <span className={styles.meetDetailIcon}>📅</span>
                            <div className={styles.meetDetailText}>
                                <span className={styles.meetDetailLabel}>Дата и время:</span>
                                {formatDate(meetDate)}
                            </div>
                        </div>

                        {meetLocation && (
                            <div className={styles.meetDetail}>
                                <span className={styles.meetDetailIcon}>📍</span>
                                <div className={styles.meetDetailText}>
                                    <span className={styles.meetDetailLabel}>Место:</span>
                                    {meetLocation}
                                </div>
                            </div>
                        )}

                        {meetDescription && (
                            <div className={styles.meetDetail}>
                                <span className={styles.meetDetailIcon}>📝</span>
                                <div className={styles.meetDetailText}>
                                    <span className={styles.meetDetailLabel}>Описание:</span>
                                    {meetDescription}
                                </div>
                            </div>
                        )}
                    </div>

                    {otherParticipants.length > 0 && (
                        <div className={styles.participantsSection}>
                            <h2 className={styles.participantsTitle}>Участники встречи</h2>
                            <div className={styles.participantsList}>
                                {otherParticipants.map((participant) => (
                                    <div key={participant.userId} className={styles.participantCard}>
                                        <img
                                            src={getAvatarUrl(participant.avatarUrl, base)}
                                            alt={participant.name}
                                            className={styles.participantAvatar}
                                        />
                                        <a
                                            href={`${base}/profile/${participant.nickname}`}
                                            className={styles.reviewButton}
                                        >
                                            <div className={styles.participantInfo}>
                                                <h3 className={styles.participantName}>{participant.name}</h3>
                                                <p className={styles.participantNickname}>@{participant.nickname}</p>
                                            </div>
                                        </a>

                                        <a
                                            href={`${base}/profile/${participant.nickname}#reviews`}
                                            className={styles.reviewButton}
                                        >
                                            Оставить отзыв
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonContainer}>
                        <a href={`${base}/account/meets/${meetId}`} className={styles.button}>
                            Перейти к встрече
                        </a>
                    </div>

                    <p className={styles.infoText}>
                        Ваши отзывы помогают другим пользователям лучше узнать друг друга. Спасибо за участие!
                    </p>

                    <footer className={styles.emailFooter}>
                        <div>Friends4Evening. 18+. Все права защищены</div>
                        <a href={'mailto:Friends4Evening@lovigin.com'} className={styles.footerLink}>Friends4Evening@lovigin.com</a>
                        <a href={`${base}`} className={styles.footerLink}>www.f4e.io</a>
                    </footer>
                </div>
            </body>
        </html>
    );
}
