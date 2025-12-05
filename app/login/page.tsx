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
import { ru, enUS } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "@/components/datepicker-custom.css";
import styles from "./page.module.css";
import Link from "next/link";
import LoadingView from "@/components/LoadingView/LoadingView";
import { subscribeUser, WebPushSubscription } from "../actions";
import { useTranslations, useLocale } from "next-intl";

registerLocale("ru", ru);
registerLocale("en", enUS);

export type LoginForm = {
    email: string,
    password: string,
}

export type RegisterForm = {
    name: string,
    birthday: Date | null,
} & LoginForm

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export default function LoginPage() {
    const router = useRouter();
    const t = useTranslations('Login');
    const locale = useLocale();

    const [isLoading, setIsLoading] = useState(false);
    const [showMobileBanner, setShowMobileBanner] = useState(false);
    const [loginForm, setLoginForm] = useState<LoginForm>({ email: "", password: "" });
    const [registrationForm, setRegistrationForm] = useState<RegisterForm>({ name: "", birthday: null, email: "", password: "" });
    const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeviceType = async () => {
            const response = await fetch('/api/device/os', {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });
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

    const completeLogin = (isRegistering: boolean, uid: string) => {
        clearLoginForm();
        clearRegistrationForm();
        subscribeToPush(uid); //REGISTER FOR NOTIFICATIONS
        setIsLoading(false);
        router.push(`/account/${isRegistering ? 'profile?tab=edit' : 'meets'}`);
    }

    const checkUserExists = async (user: User, email: string, name: string | null, avatarUrl: string | null, provider: string | null, passwordHash: string | null, birthday: Date | null) => {
        setIsLoading(true);
        const resp = await fetch('/api/auth/check', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify({ id: user.uid, email })
        })

        const data = await resp.json();

        if (resp.status === 202) { // user exists
            completeLogin(false, user.uid);
        } else if (resp.status === 404) { // new user
            if (!name || !birthday) { // show complete registration
                setIsLoading(false);
            } else {
                const resp = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                    body: JSON.stringify({ id: user.uid, email, name, avatarUrl, provider, passwordHash, birthday })
                })
                const data = await resp.json();
                const photo = user.photoURL ?? "avatar1";

                updateProfile(user, {
                    displayName: registrationForm.name ?? user.displayName,
                    photoURL: photo
                }).then(() => {
                    completeLogin(true, user.uid);
                }).catch((e) => {
                    setError(e.message);
                    setIsLoading(false);
                })
            }
        } else {
            setError(t('errors.generic', { message: data['message'] }));
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
                    setError(t('errors.userNotFound'))
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
            setError(t('errors.passwordTooShort'));
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
                    setError(t('errors.registrationError'));
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
            setError(t('errors.userNotFound'));
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

    async function subscribeToPush(uid: string) {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
            ),
        })
        const serializedSub: WebPushSubscription = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
                p256dh: (sub as any).toJSON().keys.p256dh,
                auth: (sub as any).toJSON().keys.auth,
            },
        }
        await subscribeUser(serializedSub, uid)
    }

    if (isLoading) {
        return (
            <LoadingView />
        )
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>{isLogin ? t('title.login') : t('title.register')}</h1>

                {showMobileBanner &&
                    <div className={styles.mobileBanner}>
                        <b>{t('mobileBanner.title')}</b>
                        {t('mobileBanner.description')} <br />
                        {t('mobileBanner.step1')} <br />
                        {t('mobileBanner.step2')}
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
                                placeholder={t('placeholders.email')}
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
                                placeholder={t('placeholders.password')}
                                autoComplete="section-login current-password"
                                value={loginForm.password}
                                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                            />

                            <button className={styles.submitButton} type="submit">{t('buttons.login')}</button>
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
                                placeholder={t('placeholders.name')}
                                autoComplete="section-register given-name"
                                value={registrationForm.name}
                                onChange={(event) => setRegistrationForm({ ...registrationForm, name: event.target.value })}
                            />

                            <DatePicker
                                id="register-birthday"
                                placeholderText={t('placeholders.birthday')}
                                autoComplete="section-register birthday"
                                selected={registrationForm.birthday}
                                onChange={(date) => setRegistrationForm({ ...registrationForm, birthday: date })}
                                className={styles.datePicker}
                                wrapperClassName={styles.datePickerWrapper}
                                dateFormat={locale === 'ru' ? "dd.MM.yyyy" : "MM/dd/yyyy"}
                                locale={locale === 'ru' ? 'ru' : 'en'}
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
                                placeholder={t('placeholders.registerEmail')}
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
                                    placeholder={t('placeholders.registerPassword')}
                                    autoComplete="section-register new-password"
                                    value={registrationForm.password}
                                    onChange={(event) => setRegistrationForm({ ...registrationForm, password: event.target.value })}
                                />
                            )}

                            {user !== null && user !== undefined ? (
                                <button className={styles.submitButton} onClick={() => checkUserExists(user!, registrationForm.email, registrationForm.name, user!.photoURL, "google", null, registrationForm.birthday)} type="button">{t('buttons.continue')}</button>
                            ) : (
                                <button className={styles.submitButton} type="submit">{t('buttons.register')}</button>
                            )}
                        </form>
                    </section>
                }

                {error !== null && (<div className={styles.error}>{t('errors.prefix')} {error}</div>)}

                {user === null && (
                    <>
                        <hr className={styles.divider} />

                        <button className={styles.switchButton} onClick={switchAuthMode}>{isLogin ? t('buttons.switchToRegister') : t('buttons.switchToLogin')}</button>

                        <section className={styles.socialLogin} id="social-login">
                            <GoogleLogin onComplete={handleGoogleAuth} />
                            {/* <YandexLogin /> */}
                            {/* <PhoneLogin /> */}
                        </section>
                    </>
                )}

                <p className={styles.agreementText}>
                    {t('agreement.text')}{" "}
                    <Link href="/rules" target="_blank" className={styles.agreementLink}>{t('agreement.rules')}</Link>,{" "}
                    <Link href="/agreement" target="_blank" className={styles.agreementLink}>{t('agreement.agreement')}</Link> {t('agreement.and')}{" "}
                    <Link href="/privacy" target="_blank" className={styles.agreementLink}>{t('agreement.privacy')}</Link>
                    {t('agreement.period')}
                </p>
            </div>
        </main>
    );
}