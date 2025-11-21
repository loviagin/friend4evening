"use client"

import { useAuth } from "@/app/_providers/AuthProvider"
import { Application } from "@/models/Application";
import { useEffect, useState } from "react"

export default function MyMeets() {
    // const auth = useAuth();
    // const [applications, setApplications] = useState<Application[]>([]);

    // useEffect(() => {
    //     const fetchApplications = async (userId: string) => {
    //         const resp = await fetch(`/api/applications/${userId}`);
    //         const data = await resp.json();

    //         if (resp.status === 200) {
    //             setApplications(data as Application[]);
    //         }
    //     }

    //     if (auth.user) {
    //         fetchApplications(auth.user.uid)
    //     }
    // }, [auth.user])

    return (
        <section>
            <div>
                
            </div>
        </section>
    )
}