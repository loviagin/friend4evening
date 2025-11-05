"use client"

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react"

type CtxProps = {
    user: User | null,
    loading: boolean,
}

const Ctx = createContext<CtxProps>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        })

        return unsub;
    }, [])

    return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}

export function useAuth() {
    return useContext(Ctx);
}