
"use client";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Account() {
    return (
        <main>
            This is your account
            <button style={{ margin: "80px", color: "black" }} onClick={() => signOut(auth)}>Выйти</button>
        </main>
    );
}