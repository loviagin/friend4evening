"use client";
import { createPortal } from 'react-dom';
import styles from './ShareProfile.module.css'
import { useEffect, useState } from "react";

type Props = {
    userNickname: string
    close: () => void
}

export default function ShareProfile({ userNickname }: { userNickname: string }) {
    const [showPortal, setShowPortal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        return () => setMounted(false);
    }, [])

    return (
        <>
            <button className={styles.buttonSecondary} onClick={() => setShowPortal(true)}>
                Поделиться профилем
            </button>
            {showPortal && mounted && createPortal(
                <ShareContent close={() => setShowPortal(false)} userNickname={userNickname} />,
                document.body
            )}
        </>
    )
}

export function ShareContent({ close, userNickname }: Props) {
    const [copied, setCopied] = useState(false);
    const profileUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/profile/${userNickname || ''}`
        : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (platform: string) => {
        const encodedUrl = encodeURIComponent(profileUrl);
        const encodedText = encodeURIComponent('Посмотри мой профиль на Friends4Evening!');

        const shareUrls: Record<string, string> = {
            vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedText}`,
            telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
            whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
        };

        const url = shareUrls[platform];
        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            close();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        Поделиться профилем
                    </h2>
                    <button className={styles.closeButton} onClick={close} aria-label="Закрыть">
                        ✕
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <p className={styles.shareText}>
                        Скопируйте ссылку или поделитесь профилем в социальных сетях
                    </p>
                    <div className={styles.shareInputGroup}>
                        <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className={styles.shareInput}
                        />
                        <button
                            className={styles.copyButton}
                            onClick={handleCopy}
                            disabled={copied}
                        >
                            {copied ? '✓ Скопировано' : 'Копировать'}
                        </button>
                    </div>
                    <div className={styles.socialButtons}>
                        <button
                            className={styles.socialButton}
                            onClick={() => handleShare('vk')}
                        >
                            Поделиться в VK
                        </button>
                        <button
                            className={styles.socialButton}
                            onClick={() => handleShare('telegram')}
                        >
                            Поделиться в Telegram
                        </button>
                        <button
                            className={styles.socialButton}
                            onClick={() => handleShare('whatsapp')}
                        >
                            Поделиться в WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}