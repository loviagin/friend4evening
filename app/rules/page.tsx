import Link from 'next/link';
import styles from './page.module.css';

export default function Rules() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Правила поведения пользователей</h1>
                    <p className={styles.version}>Редакция от 04.11.2025г.</p>
                </div>

                <div className={styles.intro}>
                    <p>
                        Настоящие Правила поведения (далее — «Правила») устанавливают нормы общения и использования сервиса Friend4Evening (далее — «Сервис»). Цель Правил — обеспечить безопасное, уважительное и комфортное общение между пользователями.
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Общие принципы</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>1.1.</strong> Сервис предназначен исключительно для совершеннолетних пользователей (18+).
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.2.</strong> Friend4Evening — это платформа для знакомств, общения и поиска компании на вечер.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.3.</strong> Пользуясь Сервисом, вы соглашаетесь соблюдать настоящие Правила, Пользовательское соглашение и Политику конфиденциальности.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Уважение и ответственность</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>2.1.</strong> Общайтесь вежливо, уважайте других пользователей и их личные границы.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>2.2.</strong> Не допускается:
                        </p>
                        <ul className={styles.list}>
                            <li>оскорбления, угрозы, дискриминационные высказывания;</li>
                            <li>агрессивное или навязчивое поведение;</li>
                            <li>публикация чужих личных данных без согласия.</li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>2.3.</strong> Любое преследование, домогательство или унижение приведёт к блокировке профиля без предупреждения.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Запрещённый контент</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            Пользователям запрещается размещать:
                        </p>
                        <ul className={styles.list}>
                            <li>материалы, содержащие призывы к употреблению алкоголя, наркотиков или иных веществ;</li>
                            <li>сцены распития спиртного, порнографию, эротические материалы и изображения сексуального характера;</li>
                            <li>рекламу, спам, ссылки на сторонние ресурсы без разрешения Администрации;</li>
                            <li>контент, нарушающий авторские права или законодательство страны пребывания.</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Безопасность встреч</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>4.1.</strong> Сервис не организует офлайн-встречи и не несёт ответственности за действия пользователей вне платформы.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>4.2.</strong> Перед личной встречей рекомендуется:
                        </p>
                        <ul className={styles.list}>
                            <li>договариваться только с проверенными пользователями;</li>
                            <li>встречаться в общественных местах;</li>
                            <li>информировать друзей или родственников о месте и времени встречи.</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Поведение в сообщениях и чатах</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>5.1.</strong> Не отправляйте сообщения рекламного, оскорбительного или сексуально явного характера.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>5.2.</strong> Не запрашивайте и не пересылайте персональные данные (адреса, банковские реквизиты и т. д.), если это не требуется для общения.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>5.3.</strong> Сообщайте о нарушениях через встроенную кнопку «Пожаловаться» или на почту поддержки.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Ответственность за нарушения</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>6.1.</strong> Нарушение Правил может повлечь временную или постоянную блокировку профиля без предварительного уведомления.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>6.2.</strong> Решения Администрации о блокировке окончательны и не подлежат пересмотру.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>6.3.</strong> В случае неоднократных жалоб со стороны других пользователей аккаунт может быть удалён.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>7. Изменения Правил</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>7.1.</strong> Администрация вправе вносить изменения в настоящие Правила без предварительного уведомления.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>7.2.</strong> Новая версия вступает в силу с момента публикации на сайте friend4evening.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>8. Контакты</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            По вопросам, связанным с использованием Сервиса или нарушением Правил, обращайтесь по адресу: <Link href="mailto:friend4evening@lovigin.com" className={styles.link}>friend4evening@lovigin.com</Link>
                        </p>
                    </div>
                </section>

                <div className={styles.contacts}>
                    <p className={styles.copyright}>
                        © 2025 Friend4Evening — Все права защищены.<br />
                        Возрастное ограничение: 18+
                    </p>
                </div>
            </div>
        </main>
    );
}