"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MeetType, MeetTypeLabels, User, UserLocation } from "@/models/User"
import Avatar from "@/components/Avatar/Avatar"
import { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "@/components/datepicker-custom.css";
import styles from "./EditProfile.module.css"
import DatePicker from "react-datepicker"
import { updateProfile } from "firebase/auth"
import { useAuth } from "@/app/_providers/AuthProvider"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

registerLocale("ru", ru);

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
            alert("Войдите заново в аккаунт")
            return
        }

        if (nicknameError === true) {
            alert("Никнейм занят. Пожалуйста укажите другой")
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
                const response = await fetch('/api/users/nicknames')
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
            body: JSON.stringify(form)
        })

        if (response.status !== 200) {
            alert("Ошибка сохранения. Проверьте соединение с интернетом")
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
            alert("Серверная проблема")
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
            alert("Ошибка удаления")
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

            alert("Аватар обновлён ✨");
        } catch (err) {
            console.error(err);
            alert("Ошибка при загрузке аватара");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
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
        <section id="edit-form">
            <div className={styles.avatarSection}>
                <span className={styles.formLabelText}>Аватар профиля</span>
                <Avatar avatarUrl={form.avatarUrl} />
                <input
                    type="file"
                    accept="image/*"
                    className={styles.button}
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                {uploading && <p>Загружаем...</p>}
            </div>

            <form id="edit-profile-form" onSubmit={handleEditSave} className={styles.editForm}>
                <div className={styles.formSection}>
                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>Ваше имя</span>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Введите как Вас называть"
                            value={form.name}
                            required
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={styles.formInput}
                        />
                    </label>

                    <label className={styles.formLabel} id="nickname">
                        <span className={styles.formLabelText}>Ваш никнейм</span>
                        <div className={styles.nicknameInputWrapper}>
                            <span className={styles.nicknamePrefix}>@</span>
                            <input
                                id="nickname"
                                type="text"
                                name="nickname"
                                placeholder="Придумайте никнейм (например beautifulBoy)"
                                value={form.nickname}
                                required
                                onChange={(e) => handleNicknameChange(e.target.value.trim())}
                                className={`${styles.formInput} ${styles.nicknameInput}`}
                            />
                        </div>

                        {nicknameError === true &&
                            <p className={styles.nicknameError}>
                                Данный никнейм уже занят. Выберите другой
                            </p>
                        }
                    </label>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>Email</span>
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
                        <span className={styles.formLabelText}>Дата Рождения</span>
                        <DatePicker
                            id="birthday"
                            placeholderText="Дата рождения"
                            selected={form.birthday}
                            onChange={(date) => setForm({ ...form, birthday: date ?? new Date() })}
                            className={styles.datePicker}
                            wrapperClassName={styles.datePickerWrapper}
                            dateFormat="dd.MM.yyyy"
                            locale="ru"
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
                        <span>Показывать возраст в Профиле?</span>
                    </label>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>Описание профиля</span>
                        <textarea
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            placeholder="Можете написать о себе"
                            rows={6}
                            className={styles.formTextarea}
                        />
                    </label>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>Текущая локация</span>
                        <div className={styles.locationInputs}>
                            <input
                                id="location-country"
                                type="text"
                                name="location-country"
                                placeholder="Страна"
                                value={form.location.country}
                                onChange={(e) => setForm({ ...form, location: { country: e.target.value, city: form.location.city } })}
                                className={styles.formInput}
                            />
                            <input
                                id="location-city"
                                type="text"
                                name="location-city"
                                placeholder="Город"
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
                        <span>Готов к поездке в другой город?</span>
                    </label>

                    <fieldset className={styles.formFieldset}>
                        <legend className={styles.formLegend}>Готов встретиться:</legend>
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
                                    <span>{MeetTypeLabels[option]}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <label className={styles.formLabel}>
                        <span className={styles.formLabelText}>Предпочитаемые напитки</span>
                        <div className={styles.drinksInputWrapper}>
                            <input
                                id="prefered-drinks"
                                type="text"
                                name="prefered-drinks"
                                placeholder="Введите напитки через запятую"
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
                                                aria-label="Удалить напиток"
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
                        <span>Не употребляю алкоголь</span>
                    </label>

                    {form.noAlcohol !== true && (
                        <div className={styles.warningBlock}>
                            Употребление алкоголя в больших количествах может привезти к фатальным последствиям
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
                        <span>Не курю</span>
                    </label>

                    {form.noSmoking !== true && (
                        <div className={styles.warningBlock}>
                            Курение (парение) вредит Вашему здоровью
                        </div>
                    )}
                </div>

                <div className={styles.formActions}>
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? "Сохранение..." : "Сохранить"}
                    </button>
                    <button className={styles.buttonSecondary} type="button" onClick={handleCancel}>
                        Отменить
                    </button>
                </div>
            </form>
        </section>
    )
}