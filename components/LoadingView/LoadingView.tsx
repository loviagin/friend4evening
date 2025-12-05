import styles from "./LoadingView.module.css";
import { useTranslations } from 'next-intl';

export default function LoadingView() {
    const t = useTranslations('LoadingView');
    
    return (
        <div className={styles.loader}>
            <div className={styles.container}>
                <div className={styles.spinner}></div>
                <div>
                    <div className={styles.text}>{t('text')}</div>
                    <div className={styles.dots}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}