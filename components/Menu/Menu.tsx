"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./Menu.module.css";

type MenuProps = {
  label: ReactNode;          // то, что видно всегда (кнопка, иконка и т.д.)
  children: ReactNode;       // пункты меню
};

export function Menu({ label, children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    const updateMenuPosition = () => {
      if (open && wrapperRef.current && menuRef.current && mounted) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Сначала устанавливаем базовую позицию
        menuRef.current.style.position = 'fixed';
        menuRef.current.style.top = `${rect.bottom + 8}px`;
        menuRef.current.style.left = `${rect.left}px`;
        menuRef.current.style.right = 'auto';
        menuRef.current.style.width = 'auto';
        menuRef.current.style.minWidth = `${Math.max(rect.width, 150)}px`;
        menuRef.current.style.maxWidth = `${Math.min(viewportWidth - 16, 300)}px`;
        
        // Используем requestAnimationFrame для измерения реальной ширины после рендера
        requestAnimationFrame(() => {
          if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const spaceOnRight = viewportWidth - rect.right;
            const spaceOnLeft = rect.left;
            
            // Если меню выходит за правую границу, выравниваем по правому краю кнопки
            if (menuRect.right > viewportWidth - 8) {
              menuRef.current.style.left = 'auto';
              menuRef.current.style.right = `${viewportWidth - rect.right}px`;
            } else if (spaceOnRight < menuRect.width && spaceOnLeft > spaceOnRight) {
              // Если справа мало места, но слева больше - выравниваем по правому краю
              menuRef.current.style.left = 'auto';
              menuRef.current.style.right = `${viewportWidth - rect.right}px`;
            }
          }
        });
      }
    };

    updateMenuPosition();

    if (open && mounted) {
      const handleScroll = () => {
        updateMenuPosition();
      };
      const handleResize = () => {
        updateMenuPosition();
      };

      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [open, mounted]);

  const menuContent = open && mounted && (
    <div ref={menuRef} className={styles.menu}>
      {children}
    </div>
  );

  return (
    <>
      <div ref={wrapperRef} className={styles.wrapper}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setOpen((prev) => !prev)}
        >
          {label}
          <span className={styles.arrow}>▾</span>
        </button>
      </div>
      {mounted && menuContent && createPortal(menuContent, document.body)}
    </>
  );
}

type MenuItemProps = {
  children: ReactNode;
  onSelect?: () => void;
};

export function MenuItem({ children, onSelect }: MenuItemProps) {
  return (
    <button
      type="button"
      className={styles.menuItem}
      onClick={onSelect}
      onMouseDown={(e) => e.preventDefault()} // чтобы не терять фокус
    >
      {children}
    </button>
  );
}