"use client"

import LoadingView from "@/components/LoadingView/LoadingView";
import MeetFullCard from "@/components/MeetFullCard/MeetFullCard";
import { Meet } from "@/models/Meet";
import { useEffect, useState } from "react";

export default function MeetContent({ uid }: { uid: string }) {
    const [meet, setMeet] = useState<Meet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeet = async () => {
            const r = await fetch(`/api/meets/one/${uid}`)

            if (r.status === 200) {
                const d = await r.json();
                const meet = d as Meet
                setMeet(meet);
            }
            setLoading(false);
        }

        fetchMeet();
    }, []);

    if (loading || !meet) {
        return (
            <LoadingView />
        )
    }

    return (
        <section >
            <MeetFullCard meet={meet} />
        </section>
    );
}