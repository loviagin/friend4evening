"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

type MenuProps = {
  label: ReactNode;          // то, что видно всегда (кнопка, иконка и т.д.)
  children: ReactNode;       // пункты меню
};

export function Menu({ label, children }: MenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
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

  return (
    <div ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
        <span>▾</span>
      </button>

      {open && (
        <div>
          {children}
        </div>
      )}
    </div>
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
      onClick={onSelect}
      onMouseDown={(e) => e.preventDefault()} // чтобы не терять фокус
      onMouseOver={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "rgba(0,0,0,0.04)")
      }
      onMouseOut={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "transparent")
      }
    >
      {children}
    </button>
  );
}