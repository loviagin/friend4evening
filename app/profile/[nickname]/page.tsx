
import { collection, getDocs } from 'firebase/firestore';
import UserProfilePage from './components/UserProfilePage/UserProfilePage';
import { db } from '@/lib/firebase';
import styles from './page.module.css';

export async function generateStaticParams() {
    const snap = await getDocs(collection(db, "users"));
    const nicknames = snap.docs
        .map(d => d.data().nickname)
        .filter((n): n is string => typeof n === "string" && n.length > 0);

    return nicknames.map(nickname => ({ nickname }));
}

export default async function UserProfile({ params }: { params: Promise<{ nickname: string }> }) {
    const { nickname } = await params;

    if (!nickname) {
        return (
            <main className={styles.container}>
                Пользователь не найден
            </main>
        )
    }

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Профиль</h1>
            <hr className={styles.divider} />
            
            <UserProfilePage nickname={nickname} />
        </main>
    )
}