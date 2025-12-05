"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useTranslations } from 'next-intl';
import styles from "./AgeGate.module.css";

export default function AgeGate() {
    const router = useRouter();
    const t = useTranslations('AgeGate');
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
                    <h2 className={styles.title}>{t('title')}</h2>
                    <p className={styles.text}>
                        {t('text1')}
                    </p>
                    <p className={styles.text}>
                        {t('text2')}
                    </p>
                    <div className={styles.buttons}>
                        <button onClick={handleContinue} className={styles.buttonContinue}>
                            {t('continueButton')}
                        </button>
                        <button onClick={handleExit} className={styles.buttonExit}>
                            {t('exitButton')}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
