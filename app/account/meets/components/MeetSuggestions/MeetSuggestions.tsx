"use client"
import { useEffect, useState, useRef } from 'react';
import styles from './MeetSuggestions.module.css'
import { useAuth } from '@/app/_providers/AuthProvider';
import { Meet } from '@/models/Meet';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { AiOutlineClose, AiOutlineStar, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FaWineBottle } from 'react-icons/fa';
import { MeetType, MeetTypeLabels } from '@/models/User';
import { ages } from '@/app/account/meets/components/Meets/Meets';

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
                        <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
                            {similarMeets.map((meet, i) => (
                                <div key={meet.id} className={`keen-slider__slide ${styles.slide}`}>
                                    <div className={styles.slideCard}>
                                        <div className={styles.slideHeader}>
                                            <div className={styles.starIcon}>
                                                <AiOutlineStar />
                                            </div>
                                            <div className={styles.slideTitleRow}>
                                                <h3 className={styles.slideTitle}>{meet.title}</h3>
                                                <span className={styles.slideDate}>{new Date(meet.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        {meet.description !== null && meet.description && (
                                            <p className={styles.slideDescription}>{meet.description}</p>
                                        )}
                                        <div className={styles.slideInfo}>
                                            {meet.location && (
                                                <div className={styles.slideInfoItem}>
                                                    <span>🌆</span>
                                                    <span>{meet.location}</span>
                                                    {meet.noAlcohol === true && (
                                                        <span className={styles.noAlcoholIcon} title="Не употребляю алкоголь">
                                                            <FaWineBottle />
                                                            <AiOutlineClose className={styles.noAlcoholCross} />
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            <div className={styles.slideInfoItem}>
                                                {ages.findLast((a) => a.key === meet.ageRange)?.label && (
                                                    <span>{ages.findLast((a) => a.key === meet.ageRange)?.label} лет</span>
                                                )}
                                                {meet.duration !== null && <span> • {meet.duration}</span>}
                                                {meet.membersCount !== null && <span> • До {meet.membersCount} человек</span>}
                                                {meet.meetType !== null && <span> • {MeetTypeLabels[meet.meetType as MeetType]}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    </div>
                </section>
            )}
        </>
    );
}