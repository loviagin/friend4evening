import styles from "./LoadingView.module.css";

export default function LoadingView() {
    return (
        <div className={styles.loader}>
            <div className={styles.container}>
                <div className={styles.spinner}></div>
                <div>
                    <div className={styles.text}>Загрузка</div>
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