"use client";

import { Meet, MeetStatus } from "@/models/Meet";
import { useState } from "react";
import styles from "./General.module.css";
import { useAuth } from "@/app/_providers/AuthProvider";
import { IoCopyOutline } from "react-icons/io5";
import { useTranslations, useLocale } from "next-intl";

export default function General({ meet }: { meet: Meet }) {
    const auth = useAuth();
    const t = useTranslations('MeetStatus');
    const tGeneral = useTranslations('General');
    const locale = useLocale();
    const [loading, setLoading] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleStatusChange = async (newStatus: MeetStatus) => {
        if (meet.status === MeetStatus.completed && newStatus === MeetStatus.current) return;
        if (meet.status === MeetStatus.completed && newStatus === MeetStatus.completed) return;
        if (meet.status === MeetStatus.completed && newStatus === MeetStatus.canceled) return;

        if (meet.status === MeetStatus.current && newStatus === MeetStatus.current) return;

        if (meet.status === MeetStatus.canceled && newStatus === MeetStatus.canceled) return;
        if (meet.status === MeetStatus.canceled && newStatus === MeetStatus.current) return;
        if (meet.status === MeetStatus.canceled && newStatus === MeetStatus.completed) return;

        setLoading(newStatus);
        const response = await fetch(`/api/meets/one/${meet.id}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.status === 200) {
            window.location.reload();
        } else {
            alert(t('errors.statusChange'));
            setLoading(null);
        }
    };

    const handleCopyLink = async () => {
        const meetUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/account/meets/${meet.id}`
            : '';
        
        try {
            await navigator.clipboard.writeText(meetUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.typeSection}>
                <span className={styles.typeLabel}>{tGeneral('type.label')}</span>
                <span className={`${styles.typeBadge} ${meet.type === 'open' ? styles.typeOpen : styles.typeClosed}`}>
                    {meet.type === 'open' ? tGeneral('type.open') : tGeneral('type.closed')}
                </span>
                {meet.type === 'open' && (
                    <button
                        className={styles.copyLinkButton}
                        onClick={handleCopyLink}
                        disabled={copied}
                        title={tGeneral('copyLink.title')}
                    >
                        <IoCopyOutline className={styles.copyIcon} />
                        <span>{copied ? tGeneral('copyLink.copied') : tGeneral('copyLink.button')}</span>
                    </button>
                )}
            </div>

            {meet.status === MeetStatus.current && (
                <div className={styles.statusBanner}>
                    <span className={styles.statusBannerText}>{t('banners.current')}</span>
                </div>
            )}

            {meet.status === MeetStatus.canceled && (
                <div className={`${styles.statusBanner} ${styles.statusBannerCanceled}`}>
                    <span className={styles.statusBannerText}>{t('banners.canceled')}</span>
                </div>
            )}

            {meet.status === MeetStatus.completed && (
                <div className={`${styles.statusBanner} ${styles.statusBannerCompleted}`}>
                    <span className={styles.statusBannerText}>{t('banners.completed')}</span>
                </div>
            )}

            {meet.status === MeetStatus.plan && (
                <div className={`${styles.statusBanner} ${styles.statusBannerPlan}`}>
                    <span className={styles.statusBannerText}>
                        {t('banners.plan')} {new Date(meet.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            )}

            {auth.user && meet.ownerId === auth.user.uid && (
                <div className={styles.actions}>
                    <button
                        className={`${styles.actionButton} ${styles.startButton}`}
                        onClick={() => handleStatusChange(MeetStatus.current)}
                        disabled={loading !== null}
                    >
                        {loading === MeetStatus.current ? tGeneral('buttons.start.loading') : tGeneral('buttons.start.text')}
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.completeButton}`}
                        onClick={() => handleStatusChange(MeetStatus.completed)}
                        disabled={loading !== null}
                    >
                        {loading === MeetStatus.completed ? tGeneral('buttons.complete.loading') : tGeneral('buttons.complete.text')}
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                        onClick={() => handleStatusChange(MeetStatus.canceled)}
                        disabled={loading !== null}
                    >
                        {loading === MeetStatus.canceled ? tGeneral('buttons.cancel.loading') : tGeneral('buttons.cancel.text')}
                    </button>
                </div>
            )}

            <div className={styles.comingSoon}>
                <p className={styles.comingSoonText}>
                    {tGeneral('comingSoon')}
                </p>
            </div>
        </div>
    );
}
