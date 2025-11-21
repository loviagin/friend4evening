"use client"

import { useAuth } from "@/app/_providers/AuthProvider"
import { Application, ApplicationStatusLabels, ApplicationStatus } from "@/models/Application";
import { tags } from "@/models/User";
import { useEffect, useState } from "react"
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import styles from "./MyApplications.module.css";

export default function MyApplications() {
    const auth = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const fetchApplications = async (userId: string) => {
            const resp = await fetch(`/api/applications/${userId}`);
            const data = await resp.json();

            if (resp.status === 200) {
                console.log("APPLICATIONS", data as Application[])
                setApplications(data["applications"] as Application[]);
            }
        }

        if (auth.user) {
            fetchApplications(auth.user.uid)
        }
    }, [auth]);

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
        <section className={styles.section}>
            {applications.length === 0 ? (
                <div className={styles.emptyState}>
                    У вас пока нет заявок на встречи
                </div>
            ) : (
                <div className={styles.applicationsGrid}>
                    {applications.map((ap) => (
                        <div key={ap.id} className={styles.applicationCard}>
                            <div className={styles.cardHeader}>
                                <span className={`${styles.statusBadge} ${styles[`status${ap.status.charAt(0).toUpperCase() + ap.status.slice(1)}`]}`}>
                                    {ApplicationStatusLabels[ap.status]}
                                </span>
                                {ap.title && (
                                    <h3 className={styles.cardTitle}>{ap.title}</h3>
                                )}
                            </div>

                            <div className={styles.cardBody}>
                                {ap.description && (
                                    <p className={styles.description}>
                                        {ap.description}
                                    </p>
                                )}

                                <div className={styles.cardInfo}>
                                    <div className={styles.infoItem}>
                                        <AiOutlineUsergroupAdd className={styles.infoIcon} />
                                        <span>{ap.members.length} / {ap.membersCount || '∞'} участников</span>
                                    </div>

                                    {ap.location && (
                                        <div className={styles.infoItem}>
                                            <span>🌆</span>
                                            <span>{ap.location}</span>
                                        </div>
                                    )}

                                    {ap.date && (
                                        <div className={styles.infoItem}>
                                            <span>📅</span>
                                            <span>{formatDate(ap.date)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}