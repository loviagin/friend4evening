import Link from 'next/link';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
    return (
        <section className={styles.section} id="how-it-works">
            <div className={styles.container}>
                <h2 className={styles.title}>Как это работает</h2>
                <p className={styles.subtitle}>Всего несколько шагов до встречи</p>
                
                <div className={styles.steps}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>1</div>
                        <h3 className={styles.stepTitle}>Регистрация</h3>
                        <p className={styles.stepDescription}>
                            Быстрая регистрация через соцсети или почту. 
                            Укажи свои интересы и предпочтения.
                        </p>
                    </div>
                    
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>2</div>
                        <h3 className={styles.stepTitle}>Поиск</h3>
                        <p className={styles.stepDescription}>
                            Используй фильтры для поиска подходящей компании. 
                            Возраст, интересы, локация - выбирай сам.
                        </p>
                    </div>
                    
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>3</div>
                        <h3 className={styles.stepTitle}>Общение</h3>
                        <p className={styles.stepDescription}>
                            Напиши человеку, который тебе интересен. 
                            Обсудите планы на вечер и договоритесь о встрече.
                        </p>
                    </div>
                    
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>4</div>
                        <h3 className={styles.stepTitle}>Встреча</h3>
                        <p className={styles.stepDescription}>
                            Проведите незабываемый вечер вместе! 
                            После встречи можешь оставить отзыв.
                        </p>
                    </div>
                </div>
                
                <div className={styles.cta}>
                    <Link href="/account" className={styles.button}>Начать сейчас</Link>
                </div>
            </div>
        </section>
    );
}
