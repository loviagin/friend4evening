"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { analytics, auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import GoogleLogin from "./components/GoogleLogin/GoogleLogin";
import { logEvent } from "firebase/analytics";
import DatePicker from "react-datepicker";
import bcrypt from "bcryptjs";
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "@/components/datepicker-custom.css";
import styles from "./page.module.css";
import Link from "next/link";

registerLocale("ru", ru);

export type LoginForm = {
    email: string,
    password: string,
}

export type RegisterForm = {
    name: string,
    birthday: Date | null,
} & LoginForm

export default function LoginPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [showMobileBanner, setShowMobileBanner] = useState(false);
    const [loginForm, setLoginForm] = useState<LoginForm>({ email: "", password: "" });
    const [registrationForm, setRegistrationForm] = useState<RegisterForm>({ name: "", birthday: null, email: "", password: "" });
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeviceType = async () => {
            const response = await fetch('/api/device/os');
            const data = await response.json();
            console.log(response, data);
            if (data.message === 'mobile' || data.message === 'tablet') {
                setShowMobileBanner(true);
            } else {
                setShowMobileBanner(false);
            }
        }
        console.log(user)
        fetchDeviceType()
    }, [])

    const completeLogin = (isRegistering: boolean) => {
        clearLoginForm();
        clearRegistrationForm();
        setIsLoading(false);
        router.push(`/account/${isRegistering ? 'profile?tab=edit' : 'meets'}`);
    }

    const checkUserExists = async (user: User, email: string, name: string | null, avatarUrl: string | null, provider: string | null, passwordHash: string | null, birthday: Date | null) => {
        setIsLoading(true);
        const resp = await fetch('/api/auth/check', {
            method: 'POST',
            body: JSON.stringify({ id: user.uid, email })
        })

        const data = await resp.json();

        if (resp.status === 202) { // user exists
            completeLogin(false);
        } else if (resp.status === 404) { // new user
            if (!name || !birthday) { // show complete registration
                setIsLoading(false);
            } else {
                const resp = await fetch('/api/users/register', {
                    method: 'POST',
                    body: JSON.stringify({ id: user.uid, email, name, avatarUrl, provider, passwordHash, birthday })
                })
                const data = await resp.json();

                updateProfile(user, {
                    displayName: registrationForm.name ?? user.displayName,
                    photoURL: user.photoURL
                }).then(() => {
                    completeLogin(true);
                }).catch((e) => {
                    setError(e.message);
                    setIsLoading(false);
                })
            }
        } else {
            setError(`Ошибка ${data['message']}`);
            setIsLoading(false);
        }
    }

    const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (auth.currentUser) {
            router.push('/account');
            return
        }

        setError(null)
        setIsLoading(true)
        const passwordHash = await bcrypt.hash(loginForm.password, 12);

        signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
            .then((userCredential) => {
                const user = userCredential.user

                console.log(user.email)
                if (!user) {
                    setError("Пользователь не найден")
                    return
                }

                checkUserExists(user, loginForm.email, null, null, "email", passwordHash, null);

                if (analytics) {
                    logEvent(analytics, `email_login_success ${user.email}`)
                }
            })
            .catch((e) => {
                setError(e.message)
                setIsLoading(false)
                if (analytics) {
                    logEvent(analytics, `email_login_error ${e.message}`)
                }
            })
    };

    const handleEmailRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (registrationForm.password.length < 6) {
            setError("Пароль должен быть длинее 6 символов");
            return
        }

        if (auth.currentUser) {
            router.push('/account');
            return
        }

        setError(null);
        setIsLoading(true);
        const passwordHash = await bcrypt.hash(loginForm.password, 12);

        createUserWithEmailAndPassword(auth, registrationForm.email, registrationForm.password)
            .then((userCredential) => {
                const user = userCredential.user

                if (!user) {
                    setError("Ошибка регистрации пользователь. Попробуйте позже");
                    return
                }

                checkUserExists(user, registrationForm.email, registrationForm.name, null, "email", passwordHash, registrationForm.birthday);

                if (analytics) {
                    logEvent(analytics, `email_register_success ${user.email}`);
                }
            })
            .catch((e) => {
                setError(e.message)
                setIsLoading(false);
                if (analytics) {
                    logEvent(analytics, `email_register_error ${e.message}`)
                }
            })
    };

    const handleGoogleAuth = (user: User | null, error: string | null) => {
        if (error) {
            setError(error);
            return;
        }

        if (!user || !user.email) {
            setError("Пользователь не найден");
            return;
        }

        setError(null);
        setIsLoading(true);
        setUser(user);
        setIsLogin(false);
        setRegistrationForm((prev) => ({ ...prev, name: user.displayName ?? "", email: user.email ?? "" }))
        checkUserExists(user, user.email, user.displayName, user.photoURL, "google", null, null)
    };

    const clearLoginForm = () => {
        setLoginForm({
            email: "",
            password: "",
        });
        setError(null);
    };

    const clearRegistrationForm = () => {
        setRegistrationForm({
            name: "",
            email: "",
            password: "",
            birthday: null,
        });
        setError(null);
    };

    const switchAuthMode = () => {
        setError(null)
        setIsLogin(!isLogin)
    }

    if (isLoading) {
        return (
            <div className={styles.loader}>
                <div className={styles.loaderContainer}>
                    <div className={styles.spinner}></div>
                    <div>
                        <div className={styles.text}>Загрузка</div>
                        <div className={styles.dots}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>{isLogin ? "Вход" : "Регистрация"}</h1>

                {showMobileBanner &&
                    <div className={styles.mobileBanner}>
                        <b>Добавьте иконку Friends4Evening на главный экран</b>
                        Для более быстрого доступа к Аккаунту: <br />
                        1. Нажмите поделиться или откройте меню доп действий <br />
                        2. Нажмите Добавить на главный экран
                    </div>
                }

                {isLogin ?
                    <section className={styles.section} id="login" key="login">
                        <form className={styles.form} id="login-form" onSubmit={handleEmailLogin} autoComplete="on">
                            <input
                                className={styles.input}
                                type="email"
                                id="login-email"
                                name="email"
                                required
                                placeholder="Введите ваш email"
                                autoComplete="section-login email"
                                value={loginForm.email}
                                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                            />

                            <input
                                className={styles.input}
                                type="password"
                                id="login-password"
                                name="password"
                                required
                                placeholder="Ваш пароль"
                                autoComplete="section-login current-password"
                                value={loginForm.password}
                                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                            />

                            <button className={styles.submitButton} type="submit">Войти</button>
                        </form>
                    </section>
                    :
                    <section className={styles.section} id="registration" key="registration">
                        <form className={styles.form} id="registration-form" onSubmit={handleEmailRegistration} autoComplete="on">
                            <input
                                className={styles.input}
                                type="text"
                                id="register-name"
                                name="name"
                                required
                                placeholder="Ваше имя"
                                autoComplete="section-register given-name"
                                value={registrationForm.name}
                                onChange={(event) => setRegistrationForm({ ...registrationForm, name: event.target.value })}
                            />

                            <DatePicker
                                id="register-birthday"
                                placeholderText="Ваша дата рождения"
                                autoComplete="section-register birthday"
                                selected={registrationForm.birthday}
                                onChange={(date) => setRegistrationForm({ ...registrationForm, birthday: date })}
                                className={styles.datePicker}
                                wrapperClassName={styles.datePickerWrapper}
                                dateFormat="dd.MM.yyyy"
                                locale="ru"
                                showYearDropdown
                                required
                                showMonthDropdown
                                dropdownMode="select"
                                yearDropdownItemNumber={100}
                                scrollableYearDropdown
                                minDate={new Date(1900, 0, 1)}
                                maxDate={new Date(new Date().getFullYear() - 18, 11, 31)}
                            />

                            <input
                                className={styles.input}
                                type="email"
                                id="register-email"
                                name="email"
                                required
                                placeholder="Ваш email"
                                autoComplete="section-register email"
                                disabled={user !== null && user !== undefined}
                                value={registrationForm.email}
                                onChange={(event) => setRegistrationForm({ ...registrationForm, email: event.target.value })}
                            />

                            {user === null && (
                                <input
                                    className={styles.input}
                                    type="password"
                                    id="register-password"
                                    name="password"
                                    required
                                    placeholder="Придумайте пароль"
                                    autoComplete="section-register new-password"
                                    value={registrationForm.password}
                                    onChange={(event) => setRegistrationForm({ ...registrationForm, password: event.target.value })}
                                />
                            )}

                            {user !== null && user !== undefined ? (
                                <button className={styles.submitButton} onClick={() => checkUserExists(user!, registrationForm.email, registrationForm.name, user!.photoURL, "google", null, registrationForm.birthday)} type="button">Продолжить</button>
                            ) : (
                                <button className={styles.submitButton} type="submit">Зарегистрироваться</button>
                            )}
                        </form>
                    </section>
                }

                {error !== null && (<div className={styles.error}>Ошибка: {error}</div>)}

                {user === null && (
                    <>
                        <hr className={styles.divider} />

                        <button className={styles.switchButton} onClick={switchAuthMode}>{isLogin ? "Зарегистрироваться через email" : "Войти по email"}</button>

                        <section className={styles.socialLogin} id="social-login">
                            <GoogleLogin onComplete={handleGoogleAuth} />
                            {/* <YandexLogin /> */}
                            {/* <PhoneLogin /> */}
                        </section>
                    </>
                )}

                <p className={styles.agreementText}>
                    Регистрируясь и используя сервис, вы подтверждаете, что вам исполнилось 18 лет и вы соглашаетесь с{" "}
                    <Link href="/rules" target="_blank" className={styles.agreementLink}>правилами</Link>,{" "}
                    <Link href="/agreement" target="_blank" className={styles.agreementLink}>соглашением</Link> и{" "}
                    <Link href="/privacy" target="_blank" className={styles.agreementLink}>политикой конфиденциальности</Link>.
                </p>
            </div>
        </main>
    );
}