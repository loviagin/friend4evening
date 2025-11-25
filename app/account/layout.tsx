"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_providers/AuthProvider";
import LoadingView from "@/components/LoadingView/LoadingView";

export default function AccountLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    if ((loading && loading === true) || user === null || user === undefined) {
        return (
            <LoadingView />
        );
    }

    return (
        children
    );
}