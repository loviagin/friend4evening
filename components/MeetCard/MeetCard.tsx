import { Meet, MeetStatusLabels } from "@/models/Meet";
import styles from './MeetCard.module.css'
import { AiOutlineMenu, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Menu, MenuItem } from "../Menu/Menu";

export default function MeetCard({ application }: { application: Meet }) {

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    return (
        <div className={styles.applicationCard}>
            <div className={styles.cardHeader}>
                <div className={styles.badgesRow}>
                    <span className={`${styles.statusBadge} ${styles[`status${application.status.charAt(0).toUpperCase() + application.status.slice(1)}`]}`}>
                        {MeetStatusLabels[application.status]} 
                    </span>
                    <span className={`${styles.typeBadge} ${application.type === 'open' ? styles.typeOpen : styles.typeClosed}`}>
                        {application.type === 'open' ? 'Публичная' : 'Закрытая'}
                    </span>
                </div>
                {application.title && (
                    <h3 className={styles.cardTitle}>{application.title}</h3>
                )}
            </div>

            {/* MENU */}
            <div>
                <Menu 
                    label={
                        <>
                        <AiOutlineMenu />
                        </>
                    }
                >
                    <MenuItem >Редактировать</MenuItem>
                    <MenuItem >Удалить</MenuItem>
                </Menu>
            </div>

            <div className={styles.cardBody}>
                {application.description && (
                    <p className={styles.description}>
                        {application.description}
                    </p>
                )}

                <div className={styles.cardInfo}>
                    <div className={styles.infoItem}>
                        <AiOutlineUsergroupAdd className={styles.infoIcon} />
                        <span>{application.members.filter((m) => m.status === "approved").length} / {application.membersCount || '∞'} участников</span>
                        {application.members.filter((m) => m.status === "waiting").length > 0 && (
                            <span className={styles.waitingBadge}>{application.members.filter((m) => m.status === "waiting").length} ожидает</span>
                        )}
                    </div>

                    {application.location && (
                        <div className={styles.infoItem}>
                            <span>🌆</span>
                            <span>{application.location}</span>
                        </div>
                    )}

                    {application.date && (
                        <div className={styles.infoItem}>
                            <span>📅</span>
                            <span>{formatDate(application.date)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}