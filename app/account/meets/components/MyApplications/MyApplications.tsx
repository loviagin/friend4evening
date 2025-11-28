"use client"

import { useAuth } from "@/app/_providers/AuthProvider"
import { useEffect, useState } from "react"
import styles from "./MyApplications.module.css";
import { Meet } from "@/models/Meet";
import MeetCard from "@/components/MeetCard/MeetCard";
import LoadingView from "@/components/LoadingView/LoadingView";

export default function MyApplications() {
    const auth = useAuth();
    const [applications, setApplications] = useState<Meet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async (userId: string) => {
            const resp = await fetch(`/api/meets/${userId}`);
            const data = await resp.json();

            if (resp.status === 200) {
                console.log("MEETS", data as Meet[])
                setApplications(data["meets"] as Meet[]);
            }
        }

        const checkIfMeetInPast = async (userId: string) => {
            const resp = await fetch(`/api/meets/${userId}/check`);

            if (resp.status === 200) {
                const data = await resp.json();
                console.log("check completed", data)
            }

            setLoading(false)
        }

        if (auth.user) {
            fetchApplications(auth.user.uid)
            checkIfMeetInPast(auth.user.uid)
        }
    }, [auth]);

    const handleDeleteMeet = (id: string) => {
        setApplications((prev) => ([
            ...prev.filter((m) => m.id !== id)
        ]))
    }

    if (loading) {
        return (
            <LoadingView />
        )
    }

    return (
        <section className={styles.section}>
            {applications.length === 0 ? (
                <div className={styles.emptyState}>
                    У вас пока нет заявок на встречи
                </div>
            ) : (
                <div className={styles.applicationsGrid}>
                    {applications.map((ap) => (
                        <MeetCard key={ap.id} application={ap} onDelete={handleDeleteMeet} />
                    ))}
                </div>
            )}
        </section>
    )
}