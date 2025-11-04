"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import styles from "./AgeGate.module.css";

export default function AgeGate() {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const ageVerified = localStorage.getItem("ageVerified");
        if (!ageVerified) {
            setShow(true);
        }
    }, []);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [show]);

    const handleContinue = () => {
        localStorage.setItem("ageVerified", "true");
        setShow(false);
    };

    const handleExit = () => {
        router.push('https://google.com');
    };

    if (!mounted || !show) {
        return null;
    }

    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.content}>
                    <div className={styles.icon}>🔞</div>
                    <h2 className={styles.title}>Предупреждение о контенте 18+</h2>
                    <p className={styles.text}>
                        Данный сайт содержит контент, предназначенный только для лиц старше 18 лет.
                    </p>
                    <p className={styles.text}>
                        Если вам нет 18 лет, пожалуйста, покиньте сайт.
                    </p>
                    <div className={styles.buttons}>
                        <button onClick={handleContinue} className={styles.buttonContinue}>
                            Продолжить
                        </button>
                        <button onClick={handleExit} className={styles.buttonExit}>
                            Выход
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
