import styles from './page.module.css';

export default function Agreement() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Пользовательское соглашение</h1>
                    <p className={styles.version}>Редакция от 04.11.2025г.</p>
                </div>

                <div className={styles.intro}>
                    <p>
                        Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между владельцем сайта friend4evening.online (далее — «Администрация») и пользователем сайта, мобильного приложения или иных сервисов проекта Friend4Evening (далее — «Пользователь»).
                    </p>
                    <p>
                        Используя сайт или приложение, Пользователь подтверждает, что ознакомился с данным Соглашением, понимает его условия и безоговорочно принимает их.
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Общие положения</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>1.1.</strong> Friend4Evening — это онлайн-платформа для знакомств и общения между совершеннолетними пользователями, предназначенная для поиска компании на вечер, совместного отдыха или общения по интересам.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.2.</strong> Сервис не является организатором встреч, не оказывает услуг по продаже, доставке или продвижению алкогольной продукции и не несёт ответственности за действия пользователей вне платформы.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.3.</strong> Регистрация и использование сервиса разрешены только лицам, достигшим 18 лет.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.4.</strong> Используя сервис, Пользователь соглашается с обработкой персональных данных в соответствии с Политикой конфиденциальности.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Регистрация и использование аккаунта</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>2.1.</strong> Для доступа к функциям сервиса Пользователь проходит регистрацию, предоставляя достоверную информацию.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>2.2.</strong> Пользователь несёт полную ответственность за сохранность своих данных для входа.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>2.3.</strong> Администрация вправе заблокировать или удалить аккаунт при нарушении условий настоящего Соглашения.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Права и обязанности пользователей</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>3.1.</strong> Пользователь обязуется:
                        </p>
                        <ul className={styles.list}>
                            <li>соблюдать законодательство страны своего пребывания;</li>
                            <li>использовать сервис исключительно для законных целей общения и знакомств;</li>
                            <li>не размещать материалы, содержащие:
                                <ul className={styles.sublist}>
                                    <li>оскорбления, угрозы, клевету;</li>
                                    <li>призывы к насилию, употреблению алкоголя или наркотиков;</li>
                                    <li>порнографию, сцены распития спиртных напитков;</li>
                                    <li>спам, мошеннические предложения, рекламу товаров и услуг.</li>
                                </ul>
                            </li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>3.2.</strong> Пользователь несёт личную ответственность за содержание своих сообщений и поведение при общении с другими пользователями.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>3.3.</strong> Пользователь понимает, что Администрация не проверяет достоверность информации, размещаемой другими пользователями.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Права и обязанности Администрации</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>4.1.</strong> Администрация имеет право:
                        </p>
                        <ul className={styles.list}>
                            <li>удалять материалы и блокировать пользователей при нарушении правил;</li>
                            <li>временно приостанавливать работу сервиса для технических или иных работ;</li>
                            <li>вносить изменения в функциональность сервиса без предварительного уведомления.</li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>4.2.</strong> Администрация обязуется обеспечивать конфиденциальность персональных данных Пользователей и использовать их только в пределах, предусмотренных Политикой конфиденциальности.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Ответственность сторон</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>5.1.</strong> Администрация не несёт ответственности за:
                        </p>
                        <ul className={styles.list}>
                            <li>действия пользователей внутри или за пределами платформы;</li>
                            <li>возможный вред, причинённый в результате офлайн-встреч или общения между пользователями;</li>
                            <li>сбои в работе сервиса, вызванные техническими причинами.</li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>5.2.</strong> Пользователь несёт полную ответственность за размещаемый контент и последствия его публикации.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>5.3.</strong> В случае нарушения условий Соглашения Пользователь может быть заблокирован без уведомления и без возврата оплаченных услуг (если таковые были).
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Интеллектуальная собственность</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>6.1.</strong> Все права на материалы, размещённые на сайте и в приложении (дизайн, логотип, тексты, программный код и т.д.), принадлежат Администрации.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>6.2.</strong> Копирование, распространение и использование материалов без согласия Администрации запрещено.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>7. Изменения условий</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>7.1.</strong> Администрация вправе изменять настоящее Соглашение в одностороннем порядке.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>7.2.</strong> Новая редакция вступает в силу с момента публикации на сайте friend4evening.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>7.3.</strong> Продолжение использования сервиса после изменения условий означает согласие Пользователя с новой редакцией.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>8. Прочие положения</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>8.1.</strong> Настоящее Соглашение регулируется законодательством страны Вашего пребывания.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>8.2.</strong> Все споры и разногласия подлежат рассмотрению по месту нахождения Администрации.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>8.3.</strong> Недействительность отдельного положения не влияет на действительность остальных частей Соглашения.
                        </p>
                    </div>
                </section>

                <div className={styles.contacts}>
                    <h3 className={styles.contactsTitle}>Контакты для связи</h3>
                    <p className={styles.contact}>
                        Email: <a href="mailto:friend4evening@lovigin.com" className={styles.link}>friend4evening@lovigin.com</a>
                    </p>
                    <p className={styles.copyright}>
                        © 2025 Friend4Evening — Все права защищены. 18+
                    </p>
                </div>
            </div>
        </main>
    );
}