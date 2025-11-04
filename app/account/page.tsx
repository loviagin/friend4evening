
"use client";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Account() {
    return (
        <main>
            This is your account
            <button onClick={() => signOut(auth)}>Выйти</button>
        </main>
    );
}