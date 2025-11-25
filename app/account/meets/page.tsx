"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.css'
import Meets, { ages } from './components/Meets/Meets';
import CreateMeetPortal from './components/CreateMeetPortal/CreateMeetPortal';
import MyApplications from './components/MyApplications/MyApplications';
import { useAuth } from '@/app/_providers/AuthProvider';
import { Meet } from '@/models/Meet';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { AiOutlineClose, AiOutlineStar } from 'react-icons/ai';
import { FaWineBottle } from 'react-icons/fa';
import { MeetType, MeetTypeLabels } from '@/models/User';

enum MeetsPageType {
    meets = "Поиск встречи",
    myApplications = "Встречи и заявки"
}

export default function AccountMeets() {
    const auth = useAuth();
    const [currentTab, setCurrentTab] = useState<MeetsPageType>(MeetsPageType.meets);
    const [similarMeets, setSimilarMeets] = useState<Meet[]>([]);
    const [sliderRef] = useKeenSlider({
        loop: true,
        slides: {
            perView: 1.2,
            spacing: 16,
        },
        breakpoints: {
            "(min-width: 768px)": {
                slides: {
                    perView: 1,
                    spacing: 24,
                },
            },
        },
        created(slider) {
            let timeout: ReturnType<typeof setTimeout>;
            let mouseOver = false;
            let userInteracted = false;
            
            function clearNextTimeout() {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = undefined as any;
                }
            }
            
            function nextTimeout() {
                clearNextTimeout();
                if (mouseOver || userInteracted) return;
                timeout = setTimeout(() => {
                    if (!mouseOver && !userInteracted) {
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
                if (!userInteracted) {
                    nextTimeout();
                }
            });
            
            slider.on("dragStarted", () => {
                userInteracted = true;
                clearNextTimeout();
            });
            
            slider.on("dragged", () => {
                userInteracted = true;
                clearNextTimeout();
            });
            
            slider.on("animationEnded", () => {
                if (!userInteracted && !mouseOver) {
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

    let content;
    switch (currentTab) {
        case MeetsPageType.meets:
            content = <Meets />
            break;
        case MeetsPageType.myApplications:
            content = <MyApplications />
            break;
        default:
            break;
    }

    return (
        <main className={styles.container}>
            <h1>{currentTab.toString()}</h1>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.meets ? styles.tabButtonActive : ''}`}
                    onClick={() => setCurrentTab(MeetsPageType.meets)}
                >
                    Поиск встречи
                </button>
                <button
                    className={`${styles.tabButton} ${currentTab === MeetsPageType.myApplications ? styles.tabButtonActive : ''}`}
                    onClick={() => setCurrentTab(MeetsPageType.myApplications)}
                >
                    Встречи и заявки
                </button>

                <CreateMeetPortal />
            </div>

            {/* Slider with meets */}
            {similarMeets && similarMeets.length > 0 && (
                <section className={styles.similarMeetsSection}>
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
                </section>
            )}

            <div className={styles.content}>
                {content}
            </div>
        </main>
    );
}