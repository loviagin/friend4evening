import styles from './NewFriendApplication.module.css'

export type NewFriendApplicationEmail = {
    senderName: string,
    senderId: string,
    userId: string,
    senderNickname: string,
}

export function NewFriendApplication({ senderName, senderId, userId, senderNickname }: NewFriendApplicationEmail) {
    const base = process.env.NEXT_PUBLIC_URL!

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
                        color: #466C95;
                        margin: 2rem 2rem 1rem;
                        text-align: center;
                        line-height: 1.4;
                    }
                    .${styles.titleLink} {
                        color: #466C95;
                        text-decoration: none;
                        font-weight: 700;
                        border-bottom: 2px solid #5DAE8B;
                    }
                    .${styles.divider} {
                        border: none;
                        border-top: 2px solid rgba(70, 108, 149, 0.2);
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
                    .${styles.warning} {
                        font-size: 0.9375rem;
                        color: #FF7676;
                        margin: 1.5rem 2rem;
                        text-align: center;
                        font-weight: 600;
                        font-style: italic;
                        padding: 1rem;
                        background: rgba(255, 118, 118, 0.1);
                        border-left: 3px solid #FF7676;
                        border-radius: 8px;
                        max-width: 600px;
                        margin-left: auto;
                        margin-right: auto;
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
                    .${styles.buttonsContainer} {
                        display: flex;
                        gap: 1.5rem;
                        justify-content: center;
                        align-items: center;
                        margin: 2rem auto;
                        max-width: 500px;
                        flex-wrap: wrap;
                        width: 100%;
                        padding: 0 2rem;
                    }
                    .${styles.buttonAccept},
                    .${styles.buttonDecline} {
                        display: inline-block;
                        padding: 0.875rem 2rem;
                        font-size: 1rem;
                        font-weight: 600;
                        text-decoration: none;
                        border-radius: 50px;
                        text-align: center;
                        transition: all 0.3s ease;
                        min-width: 150px;
                        flex: 0 0 auto;
                    }
                    .${styles.buttonAccept} {
                        background: linear-gradient(135deg, #466C95 0%, #5DAE8B 100%);
                        color: #ffffff !important;
                        border: none;
                    }
                    .${styles.buttonDecline} {
                        background: #ffffff;
                        color: #FF7676 !important;
                        border: 2px solid #FF7676;
                    }
                    .${styles.buttonAccept}:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(70, 108, 149, 0.3);
                    }
                    .${styles.buttonDecline}:hover {
                        background: #FF7676;
                        color: #ffffff;
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(255, 118, 118, 0.3);
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
                        У Вас новая заявка в друзья от{' '}
                        <a href={`${base}/profile/${senderNickname}`} className={styles.titleLink}>{senderName}</a>
                    </h1>
                    <hr className={styles.divider} />
                    <p className={styles.paragraph}>Вы можете принять или отклонить заявку</p>
                    <div className={styles.buttonsContainer}>
                        <a href={`${base}/api/users/${userId}/friend/accept/${senderId}`} className={styles.buttonAccept}>
                            ✓ Принять
                        </a>
                        <a href={`${base}/api/users/${userId}/friend/decline/${senderId}`} className={styles.buttonDecline}>
                            ✕ Отклонить
                        </a>
                    </div>
                    <p className={styles.infoText}>Также вы можете не принимать данную заявку и она останется в режиме ожидания</p>
                    <h6 className={styles.warning}>Не принимайте в друзья неизвестных Вам людей</h6>

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