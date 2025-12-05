"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MeetType, User, UserLocation } from "@/models/User"
import Avatar from "@/components/Avatar/Avatar"
import { registerLocale } from "react-datepicker";
import { ru, enUS } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "@/components/datepicker-custom.css";
import styles from "./EditProfile.module.css"
import DatePicker from "react-datepicker"
import { updateProfile } from "firebase/auth"
import { useAuth } from "@/app/_providers/AuthProvider"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import LoadingView from "@/components/LoadingView/LoadingView"
import { useTranslations, useLocale } from "next-intl"

registerLocale("ru", ru);
registerLocale("en", enUS);

type Props = {
    user: User,
}

export type EditForm = {
    avatarUrl: string,
    name: string,
    nickname: string,
    birthday: Date,
    showBirthday: boolean,
    bio: string,
    location: UserLocation,
    readyToTrip: boolean,
    meetIn: MeetType[],
    drinkPreferences: string[],
    noAlcohol: boolean,
    noSmoking: boolean
}

export default function EditProfile({ user }: Props) {
    const router = useRouter();
    const auth = useAuth();
    const t = useTranslations('EditProfile');
    const locale = useLocale();

    const [drinks, setDrinks] = useState("");
    const [nicknameError, setNicknameError] = useState(false);
    const [nicknames, setNicknames] = useState<string[]>([]);
    const [form, setForm] = useState<EditForm>({
        avatarUrl: user?.avatarUrl,
        name: user.name,
        nickname: user.nickname,
        birthday: user.birthday ?? new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        showBirthday: user.showBirthday ?? false,
        bio: user.bio ?? "",
        location: user.location ?? { country: "", city: "" },
        readyToTrip: user.readyToTrip ?? false,
        meetIn: user.meetIn ?? [],
        drinkPreferences: user.drinkPreferences ?? [],
        noAlcohol: user.noAlcohol ?? false,
        noSmoking: user.noSmoking ?? false,
    })
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        console.log(user.birthday)
    }, [])

    const handleEditSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!auth.user) {
            alert(t('alerts.loginRequired'))
            return
        }

        if (nicknameError === true) {
            alert(t('alerts.nicknameTaken'))
            return
        }

        checkNickname(form.nickname, () => {
            if (nicknameError === false) {
                setLoading(true);
                console.log(form);
                sendForm();
            } else {
                return
            }
        })
    }

    const handleNicknameChange = async (value: string) => {
        checkNickname(value, () => { console.log("User nickname checked") });

        setForm({ ...form, nickname: value })
    }

    const checkNickname = async (value: string, completion: () => void) => {
        if (value !== user.nickname) {
            if (nicknames.length === 0) {
                const response = await fetch('/api/users/nicknames', {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                    },
                })
                const data = await response.json();
                setNicknames(data["nicknames"]);
            }

            if (nicknames.includes(value)) {
                setNicknameError(true);
            } else {
                setNicknameError(false);
            }
        } else {
            setNicknameError(false);
        }

        completion();
    }

    const sendForm = async () => {
        const response = await fetch(`/api/profile/edit/${user.id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
            },
            body: JSON.stringify(form)
        })

        if (response.status !== 200) {
            alert(t('alerts.saveError'))
            return
        }

        const data = await response.json()
        if (data['userId'] === user.id) {
            updateProfile(auth.user!, {
                displayName: form.name,
                photoURL: form.avatarUrl
            })
            window.location.reload();
            router.push('/account/profile')
        } else {
            alert(t('alerts.serverError'))
        }

        setLoading(false);
    }

    const handleCancel = () => {
        setForm({
            avatarUrl: user?.avatarUrl,
            name: user.name,
            nickname: user.nickname,
            birthday: user.birthday ?? new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
            showBirthday: user.showBirthday ?? false,
            bio: user.bio ?? "",
            location: user.location ?? { country: "", city: "" },
            readyToTrip: user.readyToTrip ?? false,
            meetIn: user.meetIn ?? [],
            drinkPreferences: user.drinkPreferences ?? [],
            noAlcohol: user.noAlcohol ?? false,
            noSmoking: user.noSmoking ?? false,
        })
    }

    const handleSetDrinks = (value: string) => {
        if (!value.includes(',')) {
            console.log("NO ,")
            setDrinks(value)
            return
        }

        let changing = value
        for (const char of value) {
            if (char === ',') {
                const first = changing.split(',', 1)[0]

                if (!form.drinkPreferences.includes(first)) {
                    setForm((prev) => ({
                        ...prev,
                        drinkPreferences: [...prev.drinkPreferences, first]
                    }))
                }

                changing = changing.split(',', 1)[1]
                console.log(changing)
            }
        }

        if (changing) {
            setDrinks(changing.trim())
        } else {
            setDrinks("")
        }
    }

    const handleDelete = (drink: string) => {
        if (!form.drinkPreferences.includes(drink)) {
            alert(t('alerts.deleteError'))
            return
        }

        setForm((prev) => ({ ...prev, drinkPreferences: prev.drinkPreferences.filter((v) => v !== drink) }))
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const user = auth.user;

        if (!file || !user) return;

        try {
            setUploading(true);

            // путь: avatars/uid/timestamp.png
            const charSlice = file.type.indexOf('/') + 1;
            const name = file.type.slice(charSlice, file.type.length)
            const storageRef = ref(storage, `avatars/${user.uid}/avatar.${name}`);

            // загрузка файла
            await uploadBytes(storageRef, file);

            // получаем URL
            const url = await getDownloadURL(storageRef);

            // сохраняем в users
            await updateDoc(doc(db, "users", user.uid), {
                avatarUrl: url,
            });
            setForm((prev) => ({ ...prev, avatarUrl: url }))
            updateProfile(auth.user!, {
                photoURL: url,
            })

            alert(t('alerts.avatarUpdated'));
        } catch (err) {
            console.error(err);
            alert(t('alerts.avatarUploadError'));
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <LoadingView />
        )
    }

    return (
        <section id="edit-form">
            <div className={styles.avatarSection}>
                <span className={styles.formLabelText}>{t('labels.avatar')}</span>
                <Avatar avatarUrl={form.avatarUrl} />
                <input
                    type="file"
                    accept="image/*"
                    className={styles.button}
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                {uploading && <p>{t('buttons.uploading')}</p>}
            </div>

            <form id="edit-profile-form" onSubmit={handleEditSave} className={styles.editForm}>
                <div className={styles.formSection}>
                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>{t('labels.name')}</span>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder={t('placeholders.name')}
                            value={form.name}
                            required
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={styles.formInput}
                        />
                    </label>

                    <label className={styles.formLabel} id="nickname">
                        <span className={styles.formLabelText}>{t('labels.nickname')}</span>
                        <div className={styles.nicknameInputWrapper}>
                            <span className={styles.nicknamePrefix}>@</span>
                            <input
                                id="nickname"
                                type="text"
                                name="nickname"
                                placeholder={t('placeholders.nickname')}
                                value={form.nickname}
                                required
                                onChange={(e) => handleNicknameChange(e.target.value.trim())}
                                className={`${styles.formInput} ${styles.nicknameInput}`}
                            />
                        </div>

                        {nicknameError === true &&
                            <p className={styles.nicknameError}>
                                {t('errors.nicknameTaken')}
                            </p>
                        }
                    </label>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>{t('labels.email')}</span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={user.email ?? ""}
                            disabled
                            className={styles.formInput}
                        />
                    </label>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>{t('labels.birthday')}</span>
                        <DatePicker
                            id="birthday"
                            placeholderText={t('placeholders.birthday')}
                            selected={form.birthday}
                            onChange={(date) => setForm({ ...form, birthday: date ?? new Date() })}
                            className={styles.datePicker}
                            wrapperClassName={styles.datePickerWrapper}
                            dateFormat={locale === 'ru' ? "dd.MM.yyyy" : "MM/dd/yyyy"}
                            locale={locale === 'ru' ? 'ru' : 'en'}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            yearDropdownItemNumber={100}
                            scrollableYearDropdown
                            minDate={new Date(1900, 0, 1)}
                            maxDate={new Date(new Date().getFullYear() - 18, 11, 31)}
                        />
                    </label>

                    <label className={styles.checkboxLabel}>
                        <input
                            id="show-age"
                            type="checkbox"
                            name="show-age"
                            checked={form.showBirthday}
                            onChange={(e) => setForm({ ...form, showBirthday: e.target.checked })}
                            className={styles.checkboxInput}
                        />
                        <span>{t('checkboxes.showAge')}</span>
                    </label>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>{t('labels.bio')}</span>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            placeholder={t('placeholders.bio')}
                            rows={6}
                            className={styles.formTextarea}
                        />
                    </label>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>{t('labels.location')}</span>
                        <div className={styles.locationInputs}>
                            <input
                                id="location-country"
                                type="text"
                                name="location-country"
                                placeholder={t('placeholders.country')}
                                value={form.location.country}
                                onChange={(e) => setForm({ ...form, location: { country: e.target.value, city: form.location.city } })}
                                className={styles.formInput}
                            />
                            <input
                                id="location-city"
                                type="text"
                                name="location-city"
                                placeholder={t('placeholders.city')}
                                value={form.location.city}
                                onChange={(e) => setForm({ ...form, location: { country: form.location.country, city: e.target.value } })}
                                className={styles.formInput}
                            />
                        </div>
                    </label>

                    <label className={styles.checkboxLabel}>
                        <input
                            id="ready-to-trip"
                            type="checkbox"
                            name="ready-to-trip"
                            checked={form.readyToTrip}
                            onChange={(e) => setForm({ ...form, readyToTrip: e.target.checked })}
                            className={styles.checkboxInput}
                        />
                        <span>{t('checkboxes.readyToTrip')}</span>
                    </label>

                    <fieldset className={styles.formFieldset}>
                        <legend className={styles.formLegend}>{t('fieldsets.meetIn')}</legend>
                        <div className={styles.checkboxGroup}>
                            {Object.values(MeetType).map((option) => (
                                <label key={option} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={form.meetIn.includes(option)}
                                        onChange={(e) => {
                                            setForm((prev) => ({
                                                ...prev,
                                                meetIn: e.target.checked
                                                    ? [...prev.meetIn, option]
                                                    : prev.meetIn.filter((v) => v !== option)
                                            }))
                                        }}
                                        className={styles.checkboxInput}
                                    />
                                    <span>{t(`meetTypes.${option}`)}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>{t('labels.drinks')}</span>
                        <div className={styles.drinksInputWrapper}>
                            <input
                                id="prefered-drinks"
                                type="text"
                                name="prefered-drinks"
                                placeholder={t('placeholders.drinks')}
                                value={drinks}
                                onChange={(e) => handleSetDrinks(e.target.value)}
                                className={styles.formInput}
                            />
                            {form.drinkPreferences.length > 0 && (
                                <div className={styles.drinksList}>
                                    {form.drinkPreferences.map((drink) => (
                                        <div key={drink} className={styles.drinkTag}>
                                            <span>🍹 {drink}</span>
                                            <button
                                                type="button"
                                                className={styles.drinkTagButton}
                                                onClick={() => handleDelete(drink)}
                                                aria-label={t('ariaLabels.deleteDrink')}
                                            >
                                                <span className={styles.drinkTagButtonIcon}>×</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>

                    <label className={styles.checkboxLabel}>
                        <input
                            id="no-alcohol"
                            type="checkbox"
                            name="no-alcohol"
                            checked={form.noAlcohol}
                            onChange={(e) => setForm({ ...form, noAlcohol: e.target.checked })}
                            className={styles.checkboxInput}
                        />
                        <span>{t('checkboxes.noAlcohol')}</span>
                    </label>

                    {form.noAlcohol !== true && (
                        <div className={styles.warningBlock}>
                            {t('warnings.alcohol')}
                        </div>
                    )}

                    <label className={styles.checkboxLabel}>
                        <input
                            id="no-smoking"
                            type="checkbox"
                            name="no-smoking"
                            checked={form.noSmoking}
                            onChange={(e) => setForm({ ...form, noSmoking: e.target.checked })}
                            className={styles.checkboxInput}
                        />
                        <span>{t('checkboxes.noSmoking')}</span>
                    </label>

                    {form.noSmoking !== true && (
                        <div className={styles.warningBlock}>
                            {t('warnings.smoking')}
                        </div>
                    )}
                </div>

                <div className={styles.formActions}>
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? t('buttons.saving') : t('buttons.save')}
                    </button>
                    <button className={styles.buttonSecondary} type="button" onClick={handleCancel}>
                        {t('buttons.cancel')}
                    </button>
                </div>
            </form>
        </section>
    )
}