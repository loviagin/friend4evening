"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from 'next-intl';
import styles from "./Dropdown.module.css";

export default function Dropdown({ source, current, onChange }: {
    source: { key: string, label: string }[],
    current: string,
    onChange: (s: string) => void
}) {
    const t = useTranslations('Dropdown');
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [usePortal, setUsePortal] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!wrapperRef.current) return;
        
        // Проверяем, находится ли dropdown внутри модального окна
        let element = wrapperRef.current.parentElement;
        let foundModal = false;
        
        while (element && element !== document.body) {
            const classString = element.className?.toString() || '';
            if (classString.includes('overlay')) {
                const style = window.getComputedStyle(element);
                const zIndex = parseInt(style.zIndex) || 0;
                if (zIndex >= 1000) {
                    foundModal = true;
                    break;
                }
            }
            element = element.parentElement;
        }
        
        setUsePortal(foundModal);
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    setOpen(false);
                }
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    useEffect(() => {
        const updateMenuPosition = () => {
            if (open && wrapperRef.current && menuRef.current && usePortal) {
                const rect = wrapperRef.current.getBoundingClientRect();
                menuRef.current.style.position = 'fixed';
                menuRef.current.style.top = `${rect.bottom + 8}px`;
                menuRef.current.style.left = `${rect.left}px`;
                menuRef.current.style.width = `${rect.width}px`;
            }
        };

        updateMenuPosition();

        if (open && usePortal) {
            // Обновляем позицию при прокрутке
            const handleScroll = () => {
                updateMenuPosition();
            };

            // Слушаем прокрутку на всех элементах (включая модальное окно)
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);

            // Также слушаем прокрутку на модальном окне
            let modalElement: Element | null = null;
            if (wrapperRef.current) {
                let element = wrapperRef.current.parentElement;
                while (element && element !== document.body) {
                    const classString = element.className?.toString() || '';
                    if (classString.includes('modal')) {
                        modalElement = element;
                        break;
                    }
                    element = element.parentElement;
                }
            }
            
            if (modalElement) {
                modalElement.addEventListener('scroll', handleScroll);
            }

            return () => {
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleScroll);
                if (modalElement) {
                    modalElement.removeEventListener('scroll', handleScroll);
                }
            };
        }
    }, [open, usePortal]);

    const menuContent = open && (
        <div className={styles.menu} ref={menuRef}>
            {source.map(s => (
                <div
                    key={s.key}
                    className={styles.item}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onChange(s.key);
                        setOpen(false);
                    }}
                >
                    {s.label}
                </div>
            ))}
        </div>
    );

    return (
        <>
            <div className={styles.wrapper} ref={wrapperRef}>
                <button
                    type="button"
                    className={styles.mainButton}
                    onClick={() => setOpen(!open)}
                >
                    {source.find(s => s.key === current)?.label || t('defaultLabel')}
                    <span className={styles.arrow}>▾</span>
                </button>
                {!usePortal && menuContent}
            </div>
            {mounted && open && usePortal && createPortal(menuContent, document.body)}
        </>
    );
}