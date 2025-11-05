"use client"
import { auth } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import styles from './page.module.css'
import { User } from '@/models/User';

export default function AccountProfile() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            console.log("uid", auth.currentUser?.uid);
            const response = await fetch(`/api/users/${auth.currentUser?.uid}`)
            const data = await response.json();
            setUser(data as User);
            console.log("data", data);
        }

        fetchUser()
    }, []);

    return (
        <main className={styles.container}>
            <h1>Профиль</h1>
            <hr />

        </main>
    );
}