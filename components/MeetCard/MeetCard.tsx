import { Meet, MeetStatusLabels } from "@/models/Meet";
import styles from './MeetCard.module.css'
import { AiOutlineMenu, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Menu, MenuItem } from "../Menu/Menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";

export default function MeetCard({ application, onDelete }: { application: Meet, onDelete: (id: string) => void }) {
    const auth = useAuth()
    const router = useRouter();

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const handleDelete = async () => {
        if (window.confirm("Вы уверены, что хотите удалить эту встречу?")) {
            onDelete(application.id);
            const r = await fetch(`/api/meets/one/${application.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            })

            if (r.status === 200) {
                console.log("OK Deletion of meet")
            }
        }
    }

    return (
        <div className={styles.applicationCard}>
            <div className={styles.cardHeader}>
                <div className={styles.badgesRow}>
                    <span className={`${styles.statusBadge} ${styles[`status${application.status.charAt(0).toUpperCase() + application.status.slice(1)}`]}`}>
                        {MeetStatusLabels[application.status]}
                    </span>
                    <span className={`${styles.typeBadge} ${application.type === 'open' ? styles.typeOpen : styles.typeClosed}`}>
                        {application.type === 'open' ? 'Публичная' : 'Личная'}
                    </span>
                </div>
                <div className={styles.titleRow}>
                    <Link href={`meets/${application.id}`} target="_blank" className={styles.titleLink}>
                        {application.title && (
                            <h3 className={styles.cardTitle}>{application.title}</h3>
                        )}
                    </Link>
                    {auth.user && application.ownerId === auth.user.uid && (
                        <Menu
                            label={
                                <>
                                    <AiOutlineMenu />
                                </>
                            }
                        >
                            <MenuItem onSelect={() => router.push(`/account/meets/${application.id}`)}>Редактировать</MenuItem>
                            <MenuItem onSelect={handleDelete}>Удалить</MenuItem>
                        </Menu>
                    )}
                </div>
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
                        {auth.user && application.ownerId === auth.user.uid && application.members.filter((m) => m.status === "waiting").length > 0 && (
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