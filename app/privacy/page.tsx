import Link from 'next/link';
import styles from './page.module.css';

export default function Privacy() {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Политика конфиденциальности</h1>
                    <p className={styles.version}>Редакция от 04.11.2025г.</p>
                </div>

                <div className={styles.intro}>
                    <p>
                        Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок обработки и защиты персональных данных пользователей сайта friend4evening, мобильного приложения и связанных сервисов (далее — «Сервис»), принадлежащих Администрации проекта Friend4Evening (далее — «Администрация»).
                    </p>
                    <p>
                        Используя Сервис, Пользователь выражает согласие с условиями данной Политики.
                    </p>
                </div>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Общие положения</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>1.1.</strong> Настоящая Политика разработана в соответствии с Федеральным законом РФ №152-ФЗ «О персональных данных», а также с общими принципами GDPR.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.2.</strong> Цель обработки персональных данных — обеспечение работы Сервиса, предоставление функционала знакомств, а также поддержание связи с Пользователем.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>1.3.</strong> Администрация не собирает и не обрабатывает персональные данные несовершеннолетних лиц (до 18 лет). При обнаружении такого аккаунта доступ блокируется.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Состав собираемых данных</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>2.1.</strong> При регистрации и использовании Сервиса могут собираться следующие категории данных:
                        </p>
                        <ul className={styles.list}>
                            <li>имя или никнейм Пользователя;</li>
                            <li>адрес электронной почты;</li>
                            <li>дата рождения (для подтверждения возраста 18+);</li>
                            <li>город или геолокация (по согласию);</li>
                            <li>фото, описания и сообщения, отправленные внутри Сервиса;</li>
                            <li>техническая информация: IP-адрес, тип устройства, данные cookie.</li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>2.2.</strong> Администрация не запрашивает и не хранит финансовую информацию, пароли от сторонних сервисов и иные чувствительные данные.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Цели обработки данных</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>3.1.</strong> Персональные данные используются исключительно для:
                        </p>
                        <ul className={styles.list}>
                            <li>регистрации и авторизации пользователей;</li>
                            <li>обеспечения работы Сервиса и его функций;</li>
                            <li>улучшения качества работы и персонализации контента;</li>
                            <li>связи с Пользователями (уведомления, поддержка, новости проекта);</li>
                            <li>соблюдения требований законодательства.</li>
                        </ul>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Передача и хранение данных</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>4.1.</strong> Администрация хранит персональные данные на защищённых серверах и принимает все разумные меры для их защиты.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>4.2.</strong> Доступ к данным имеют только уполномоченные сотрудники или подрядчики, подписавшие соглашение о конфиденциальности.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>4.3.</strong> Передача данных третьим лицам возможна только:
                        </p>
                        <ul className={styles.list}>
                            <li>с согласия Пользователя;</li>
                            <li>по требованию государственных органов на законных основаниях;</li>
                            <li>при необходимости для функционирования Сервиса (например, при использовании сторонних сервисов авторизации или аналитики).</li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>4.4.</strong> Хранение персональных данных осуществляется в течение срока действия аккаунта Пользователя. После удаления профиля данные удаляются в течение 30 дней.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Cookie и аналитика</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>5.1.</strong> Сайт может использовать файлы cookie для корректной работы и анализа трафика.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>5.2.</strong> Cookie не содержат персональных данных и могут быть отключены Пользователем в настройках браузера.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>5.3.</strong> Сервис может использовать инструменты аналитики (например, Google Analytics, Яндекс.Метрика) исключительно для статистических целей.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Права пользователя</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>6.1.</strong> Пользователь имеет право:
                        </p>
                        <ul className={styles.list}>
                            <li>получать информацию о своих персональных данных и их обработке;</li>
                            <li>изменять или удалять свои данные в личном кабинете;</li>
                            <li>отзывать согласие на обработку персональных данных;</li>
                            <li>требовать прекращения рассылок.</li>
                        </ul>
                        <p className={styles.paragraph}>
                            <strong>6.2.</strong> Для реализации этих прав Пользователь может направить обращение на электронную почту friend4evening@lovigin.com.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>7. Ответственность</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>7.1.</strong> Администрация не несёт ответственности за действия третьих лиц, получивших доступ к данным Пользователя в результате несанкционированных действий самого Пользователя.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>7.2.</strong> Пользователь обязуется не размещать на платформе личные данные других лиц без их согласия.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>8. Изменения Политики</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            <strong>8.1.</strong> Администрация вправе изменять настоящую Политику в одностороннем порядке.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>8.2.</strong> Новая редакция вступает в силу с момента публикации на сайте friend4evening.
                        </p>
                        <p className={styles.paragraph}>
                            <strong>8.3.</strong> Продолжение использования Сервиса после изменения Политики означает согласие Пользователя с её новой редакцией.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>9. Контактная информация</h2>
                    <div className={styles.content}>
                        <p className={styles.paragraph}>
                            По всем вопросам, связанным с обработкой персональных данных, Пользователь может обратиться по адресу: <Link href="mailto:friend4evening@lovigin.com" className={styles.link}>friend4evening@lovigin.com</Link>
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