import { Meet } from "@/models/Meet";
import styles from './MeetCard.module.css'
import { AiOutlineMenu, AiOutlineUsergroupAdd } from "react-icons/ai";
import { Menu, MenuItem } from "../Menu/Menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";
import { useTranslations, useLocale } from 'next-intl';

export default function MeetCard({ application, onDelete }: { application: Meet, onDelete: (id: string) => void }) {
    const auth = useAuth()
    const router = useRouter();
    const t = useTranslations('MeetCard');
    const locale = useLocale();

    const formatDate = (date: Date) => {
        const d = new Date(date);
        // Маппинг локалей для Intl.DateTimeFormat
        const localeMap: Record<string, string> = {
            'ru': 'ru-RU',
            'en': 'en-US'
        };
        const intlLocale = localeMap[locale] || locale;
        
        return d.toLocaleDateString(intlLocale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        if (window.confirm(t('deleteConfirm'))) {
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
                        {t(`status.${application.status}`)}
                    </span>
                    <span className={`${styles.typeBadge} ${application.type === 'open' ? styles.typeOpen : styles.typeClosed}`}>
                        {application.type === 'open' ? t('type.open') : t('type.closed')}
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
                            <MenuItem onSelect={() => router.push(`/account/meets/${application.id}`)}>{t('menu.edit')}</MenuItem>
                            <MenuItem onSelect={handleDelete}>{t('menu.delete')}</MenuItem>
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
                        <span>{application.members.filter((m) => m.status === "approved").length} / {application.membersCount || '∞'} {t('members')}</span>
                        {auth.user && application.ownerId === auth.user.uid && application.members.filter((m) => m.status === "waiting").length > 0 && (
                            <span className={styles.waitingBadge}>{application.members.filter((m) => m.status === "waiting").length} {t('waiting')}</span>
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