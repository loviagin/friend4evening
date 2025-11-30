import { collection, getDocs, query, where } from 'firebase/firestore';
import MeetContent from './components/MeetContent/MeetContent';
import styles from './page.module.css'
import { db } from '@/lib/firebase';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const q = query(collection(db, "meets"), where("type", "==", "open"))
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id }));
}

export const metadata: Metadata = {
    robots: {
    index: false,
    follow: false
  }
}

export default async function Meet({ params }: { params: Promise<{ uid: string }> }) {

    const { uid } = await params;

    return(
        <main className={styles.container}>
            <MeetContent uid={uid} />
        </main>
    );
}