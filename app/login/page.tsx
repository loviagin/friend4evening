"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { analytics, auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import GoogleLogin from "./components/GoogleLogin/GoogleLogin";
import { logEvent } from "firebase/analytics";
import PhoneLogin from "./components/PhoneLogin/PhoneLogin";
import styles from "./page.module.css";

export type LoginForm = {
    email: string,
    password: string,
}

export type RegisterForm = {
    name: string,
} & LoginForm

export default function LoginPage() {
    const router = useRouter();

    const [loginForm, setLoginForm] = useState<LoginForm>({ email: "", password: "" });
    const [registrationForm, setRegistrationForm] = useState<RegisterForm>({ name: "", email: "", password: "" });
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
            .then((userCredential) => {
                const email = userCredential.user.email
                console.log(email)
                clearLoginForm()
                if (analytics) {
                    logEvent(analytics, `email_login_success ${email}`)
                }
                router.push('/')
            })
            .catch((e) => {
                setError(e.message)
                if (analytics) {
                    logEvent(analytics, `email_login_error ${e.message}`)
                }
            })
    };

    const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (registrationForm.password.length < 6) {
            setError("Пароль должен быть длинее 6 символов");
            return
        }

        setError(null);

        createUserWithEmailAndPassword(auth, registrationForm.email, registrationForm.password)
            .then((userCredential) => {
                const user = userCredential.user
                updateProfile(user, {
                    displayName: registrationForm.name
                }).then(() => {
                    clearRegistrationForm()
                    if (analytics) {
                        logEvent(analytics, `email_register_success ${user.email}`)
                    }
                    router.push('/')
                }).catch((e) => { 
                    setError(e.message) 
                    if (analytics) {
                        logEvent(analytics, `email_register_error ${e.message}`)
                    }
                })
            })
            .catch((e) => {
                setError(e.message)
            })
    };

    const handleGoogleAuth = (userId: string | null, error: string | null) => {
        if (error) {
            setError(error);
            return;
        }

        if (!userId) {
            setError("Пользователь не найден");
            return;
        }

        router.push('/');
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
        });
        setError(null);
    };

    const switchAuthMode = () => {
        setError(null)
        setIsLogin(!isLogin)
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>{isLogin ? "Вход" : "Регистрация"}</h1>
                {isLogin ?
                <section className={styles.section} id="login" key="login">
                    <form className={styles.form} id="login-form" onSubmit={handleLogin} autoComplete="on">
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
                    <form className={styles.form} id="registration-form" onSubmit={handleRegistration} autoComplete="on">
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

                        <input
                            className={styles.input}
                            type="email"
                            id="register-email"
                            name="email"
                            required
                            placeholder="Ваш email"
                            autoComplete="section-register email"
                            value={registrationForm.email}
                            onChange={(event) => setRegistrationForm({ ...registrationForm, email: event.target.value })}
                        />

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

                        <button className={styles.submitButton} type="submit">Зарегистрироваться</button>
                    </form>
                </section>
            }

            {error !== null && (<div className={styles.error}>Ошибка: {error}</div>)}

            <hr className={styles.divider} />

            <button className={styles.switchButton} onClick={switchAuthMode}>{isLogin ? "Зарегистрировать через email" : "Войти по email"}</button>

            <section className={styles.socialLogin} id="social-login">
                <GoogleLogin onComplete={handleGoogleAuth} />
                {/* <YandexLogin /> */}
                {/* <PhoneLogin /> */}
            </section>
            </div>
        </main>
    );
}