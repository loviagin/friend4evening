"use client"
import { useEffect, useState, useRef } from 'react';
import styles from './MeetSuggestions.module.css'
import { useAuth } from '@/app/_providers/AuthProvider';
import { Meet } from '@/models/Meet';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import MeetFullCard from '@/components/MeetFullCard/MeetFullCard';

export default function MeetSuggestions() {
    const auth = useAuth();
    const [similarMeets, setSimilarMeets] = useState<Meet[]>([]);
    const userInteractedRef = useRef(false);
    const clearTimeoutRef = useRef<(() => void) | null>(null);

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slides: {
            perView: 1.2,
            spacing: 16,
        },
        breakpoints: {
            "(min-width: 480px)": {
                slides: {
                    perView: 1.3,
                    spacing: 18,
                },
            },
            "(min-width: 640px)": {
                slides: {
                    perView: 1.5,
                    spacing: 20,
                },
            },
            "(min-width: 768px)": {
                slides: {
                    perView: 1.2,
                    spacing: 20,
                },
            },
            "(min-width: 1024px)": {
                slides: {
                    perView: 1,
                    spacing: 24,
                },
            },
        },
        drag: true,
        dragSpeed: 0.8,
        rubberband: true,
        created(slider) {
            let timeout: ReturnType<typeof setTimeout>;
            let mouseOver = false;

            function clearNextTimeout() {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = undefined as any;
                }
            }

            // Сохраняем функцию очистки в ref для доступа из обработчиков кнопок
            clearTimeoutRef.current = clearNextTimeout;

            function nextTimeout() {
                clearNextTimeout();
                if (mouseOver || userInteractedRef.current) return;
                timeout = setTimeout(() => {
                    if (!mouseOver && !userInteractedRef.current) {
                        slider.next();
                    }
                }, 3000);
            }

            // Запускаем автопрокрутку сразу после создания
            nextTimeout();

            slider.container.addEventListener("mouseenter", () => {
                mouseOver = true;
                clearNextTimeout();
            });

            slider.container.addEventListener("mouseleave", () => {
                mouseOver = false;
                if (!userInteractedRef.current) {
                    nextTimeout();
                }
            });

            slider.on("dragStarted", () => {
                userInteractedRef.current = true;
                clearNextTimeout();
            });

            slider.on("dragged", () => {
                userInteractedRef.current = true;
                clearNextTimeout();
            });

            slider.on("animationEnded", () => {
                if (!userInteractedRef.current && !mouseOver) {
                    nextTimeout();
                }
            });
        },
    })

    useEffect(() => {
        const fetchSimilarMeets = async (userId: string) => {
            const r = await fetch(`/api/meets/${userId}/similar`);

            if (r.status === 200) {
                const data = await r.json();
                const meets = data["meets"] as Meet[];
                console.log("MEETS", meets)
                setSimilarMeets(meets);
            } else {
                console.log("NO SIMILAR MEETs")
            }
        }

        if (auth.user) {
            fetchSimilarMeets(auth.user.uid);
        }
    }, [auth])

    return (
        <>
            {/* Slider with meets */}
            {similarMeets && similarMeets.length > 0 && (
                <section className={styles.similarMeetsSection}>
                    <div className={styles.sliderWrapper}>
                        {similarMeets.length > 1 && (
                            <button
                                className={`${styles.sliderArrow} ${styles.sliderArrowLeft}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    userInteractedRef.current = true;
                                    if (clearTimeoutRef.current) {
                                        clearTimeoutRef.current();
                                    }
                                    instanceRef.current?.prev();
                                }}
                                aria-label="Previous slide"
                            >
                                <AiOutlineLeft />
                            </button>
                        )}

                        <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
                            {similarMeets.map((meet) => (
                                <MeetFullCard key={meet.id} meet={meet} />
                            ))}
                        </div>

                        {similarMeets.length > 1 && (
                            <button
                                className={`${styles.sliderArrow} ${styles.sliderArrowRight}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    userInteractedRef.current = true;
                                    if (clearTimeoutRef.current) {
                                        clearTimeoutRef.current();
                                    }
                                    instanceRef.current?.next();
                                }}
                                aria-label="Next slide"
                            >
                                <AiOutlineRight />
                            </button>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}