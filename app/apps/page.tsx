import { FaApple, FaAndroid } from 'react-icons/fa';
import { IoShareOutline } from 'react-icons/io5';
import styles from './page.module.css';
import { LuSquarePlus } from 'react-icons/lu';

export default function AppsPage() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Мобильные приложения</h1>
                    <p className={styles.subtitle}>
                        Установите Friends4Evening на свой телефон для удобного доступа
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Как установить PWA приложение</h2>
                    
                    <div className={styles.instructionsGrid}>
                        <div className={styles.instructionCard}>
                            <div className={styles.instructionHeader}>
                                <div className={styles.platformIcon}>
                                    <FaApple className={styles.icon} />
                                </div>
                                <h3 className={styles.platformTitle}>iOS (iPhone/iPad)</h3>
                            </div>
                            <ol className={styles.stepsList}>
                                <li className={styles.step}>
                                    Откройте сайт Friends4Evening в браузере Safari
                                </li>
                                <li className={styles.step}>
                                    Нажмите на кнопку <span className={styles.buttonHint}>
                                        <IoShareOutline className={styles.inlineIcon} /> Поделиться
                                    </span> внизу экрана
                                </li>
                                <li className={styles.step}>
                                    Выберите <span className={styles.buttonHint}>
                                        <LuSquarePlus className={styles.inlineIcon} /> На экран «Домой»
                                    </span>
                                </li>
                                <li className={styles.step}>
                                    Подтвердите установку, нажав «Добавить»
                                </li>
                                <li className={styles.step}>
                                    Приложение появится на главном экране вашего устройства
                                </li>
                            </ol>
                        </div>

                        <div className={styles.instructionCard}>
                            <div className={styles.instructionHeader}>
                                <div className={styles.platformIcon}>
                                    <FaAndroid className={styles.icon} />
                                </div>
                                <h3 className={styles.platformTitle}>Android</h3>
                            </div>
                            <ol className={styles.stepsList}>
                                <li className={styles.step}>
                                    Откройте сайт Friends4Evening в браузере Chrome
                                </li>
                                <li className={styles.step}>
                                    Нажмите на меню <span className={styles.buttonHint}>
                                        ⋮
                                    </span> в правом верхнем углу
                                </li>
                                <li className={styles.step}>
                                    Выберите <span className={styles.buttonHint}>
                                        «Установить приложение» или «Добавить на главный экран»
                                    </span>
                                </li>
                                <li className={styles.step}>
                                    Подтвердите установку в появившемся окне
                                </li>
                                <li className={styles.step}>
                                    Приложение будет установлено и появится на главном экране
                                </li>
                            </ol>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Нативные приложения</h2>
                    <p className={styles.sectionDescription}>
                        Скоро появятся полнофункциональные приложения для iOS и Android
                    </p>
                    
                    <div className={styles.appsGrid}>
                        <div className={styles.appCard}>
                            <div className={styles.appCardContent}>
                                <div className={styles.appIconWrapper}>
                                    <FaApple className={styles.appIcon} />
                                </div>
                                <h3 className={styles.appTitle}>iOS приложение</h3>
                                <p className={styles.appDescription}>
                                    Приложение для iPhone и iPad будет доступно в App Store
                                </p>
                                <div className={styles.statusBadge}>
                                    <span className={styles.statusText}>В разработке</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.appCard}>
                            <div className={styles.appCardContent}>
                                <div className={styles.appIconWrapper}>
                                    <FaAndroid className={styles.appIcon} />
                                </div>
                                <h3 className={styles.appTitle}>Android приложение</h3>
                                <p className={styles.appDescription}>
                                    Приложение для Android будет доступно в Google Play
                                </p>
                                <div className={styles.statusBadge}>
                                    <span className={styles.statusText}>В разработке</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
