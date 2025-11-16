"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Dropdown.module.css";

export default function Dropdown({ source, current, onChange }: {
    source: { key: string, label: string }[],
    current: string,
    onChange: (s: string) => void
}) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <button
                className={styles.mainButton}
                onClick={() => setOpen(!open)}
            >
                {source.find(s => s.key === current)?.label || "Задать статус"}
                <span className={styles.arrow}>▾</span>
            </button>

            {open && (
                <div className={styles.menu}>
                    {source.map(s => (
                        <div
                            key={s.key}
                            className={styles.item}
                            onClick={() => {
                                onChange(s.key);
                                setOpen(false);
                            }}
                        >
                            {s.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}