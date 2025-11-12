"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_providers/AuthProvider";

export default function Account() {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (auth.user) {
            router.replace("/account/profile");
        }
    }, [router]);

    return (
        <main>
        </main>
    );
}