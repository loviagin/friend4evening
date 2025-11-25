import MeetContent from './components/MeetContent/MeetContent';
import styles from './page.module.css'

export default async function Meet({ params }: { params: Promise<{ uid: string }> }) {

    const { uid } = await params;

    return(
        <main className={styles.container}>
            <MeetContent uid={uid} />
        </main>
    );
}