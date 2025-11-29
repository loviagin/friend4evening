"use client";

import Dropdown from "@/components/Dropdown/Dropdown";
import { User } from "@/models/User";
import { useEffect, useState, useRef } from "react";
import styles from "./Meets.module.css";
import UserCard from "@/components/UserCard/UserCard";
import MeetSuggestions from "../MeetSuggestions/MeetSuggestions";
import LoadingView from "@/components/LoadingView/LoadingView";

export const ages: { key: string, label: string }[] = [
    { key: "none", label: "Не важно" },
    { key: "18-22", label: "18 – 22" },
    { key: "23-27", label: "23 – 27" },
    { key: "28-35", label: "28 – 35" },
    { key: "36-45", label: "36 – 45" },
    { key: "46-60", label: "46 – 60" },
    { key: "60", label: "60 +" },
]

const statuses: { key: string, label: string }[] = [
    { key: "none", label: "Не важно" },
    { key: "READY", label: "Готов к встрече" },
    { key: "INTENSIVE_SEARCH", label: "В активном поиске" }
]

export const meetType: { key: string, label: string }[] = [
    { key: "none", label: "Не важно" },
    { key: "CURRENT_HOME", label: "У себя дома" },
    { key: "USER_HOME", label: "У других дома" },
    { key: "STREET", label: "На улице" },
    { key: "PUBLIC_PLACES", label: "В общественных местах" },
    { key: "PARKS", label: "В парках" },
    { key: "CAFES", label: "В кафе/ресторанах" },
    { key: "ONLINE", label: "Онлайн" }
]

type SearchForm = {
    age: string,
    status: string,
    city: string,
    meetType: string
}

export default function Meets() {
    const [users, setUsers] = useState<User[]>([]);
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [form, setForm] = useState<SearchForm>({ age: "none", status: "none", city: "", meetType: "none" })
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const cityInputRef = useRef<HTMLInputElement>(null);
    const citySuggestionsRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const resp = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });
            const data = await resp.json()

            if (resp.status === 200) {
                const users = data['users'] as User[]
                console.log(users);
                setUsers(users);
                setSortedUsers(users);
            }

        }

        const fetchCities = async () => {
            const resp = await fetch('/api/cities', {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN!}`,
                },
            });
            const data = await resp.json()

            if (resp.status === 200) {
                const cities = data['cities'] as string[]
                console.log(cities);
                setCities(cities);
                setFilteredCities(cities);
            }

            setLoading(false);
        }

        fetchUsers();
        fetchCities();
    }, []);

    useEffect(() => {
        applyFilters(form.age, form.status, form.city, form.meetType);
    }, [users]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                cityInputRef.current &&
                citySuggestionsRef.current &&
                !cityInputRef.current.contains(event.target as Node) &&
                !citySuggestionsRef.current.contains(event.target as Node)
            ) {
                setShowCitySuggestions(false);
            }
        };

        if (showCitySuggestions) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCitySuggestions]);

    const applyFilters = (
        ageValue: string,
        statusValue: string,
        cityValue: string,
        meetTypeValue: string
    ) => {
        const sorted = sortUsers(users, ageValue, statusValue, cityValue, meetTypeValue);
        setSortedUsers(sorted);
    };

    const handleChangeAge = (newAge: string) => {
        setForm((prev) => {
            const updated = { ...prev, age: newAge };
            applyFilters(updated.age, updated.status, updated.city, updated.meetType);
            return updated;
        });
    };

    const handleCityInputFocus = () => {
        if (form.city.trim() === '') {
            setFilteredCities(cities);
        } else {
            const filtered = cities.filter(city =>
                city.toLowerCase().includes(form.city.toLowerCase())
            );
            setFilteredCities(filtered);
        }
        setShowCitySuggestions(true);
    };

    const handleChangeCity = (newCity: string) => {
        setForm((prev) => {
            const updated = { ...prev, city: newCity };

            // фильтрация подсказок
            if (newCity.trim() === '') {
                setFilteredCities(cities);
            } else {
                const filtered = cities.filter(city =>
                    city.toLowerCase().includes(newCity.toLowerCase())
                );
                setFilteredCities(filtered);
            }

            setShowCitySuggestions(true);
            applyFilters(updated.age, updated.status, updated.city, updated.meetType);

            return updated;
        });
    };

    const handleCitySelect = (city: string) => {
        setForm((prev) => {
            const updated = { ...prev, city };
            applyFilters(updated.age, updated.status, updated.city, updated.meetType);
            return updated;
        });
        setShowCitySuggestions(false);
    };
    const handleStatusChange = (status: string) => {
        setForm((prev) => {
            const updated = { ...prev, status };
            applyFilters(updated.age, updated.status, updated.city, updated.meetType);
            return updated;
        });
    };

    const handleMeetTypeChange = (newMeet: string) => {
        setForm((prev) => {
            const updated = { ...prev, meetType: newMeet };
            applyFilters(updated.age, updated.status, updated.city, updated.meetType);
            return updated;
        });
    };

    function sortUsers(
        users: User[],
        ageRange: string,   // "none" | "18-22" | ...
        status: string,     // "none" | "READY" | "INTENSIVE_SEARCH"
        city: string,       // "" или конкретный город
        meetType: string    // "none" | "CURRENT_HOME" | ...
    ): User[] {
        if (
            ageRange === "none" &&
            status === "none" &&
            city.trim() === "" &&
            meetType === "none"
        ) {
            return [...users]; // без фильтров — просто копия
        }

        // --- возраст ---
        const [minStr, maxStr] = ageRange !== "none" ? ageRange.split("-") : [undefined, undefined];
        const min = minStr ? Number(minStr) : -Infinity;
        const max = maxStr ? Number(maxStr) : (ageRange === "60" ? Infinity : Infinity);

        const calcAge = (birthday: Date | string | null | undefined) => {
            if (!birthday) return Infinity;

            const d = new Date(birthday);
            if (isNaN(d.getTime())) return Infinity;

            const today = new Date();
            let age = today.getFullYear() - d.getFullYear();
            const m = today.getMonth() - d.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
                age--;
            }
            return age;
        };

        const normalizedCity = city.trim().toLowerCase();

        const copy = [...users];

        return copy.sort((a, b) => {
            const ageA = calcAge(a.birthday);
            const ageB = calcAge(b.birthday);

            const inAgeA = ageRange === "none" ? true : ageA >= min && ageA <= max;
            const inAgeB = ageRange === "none" ? true : ageB >= min && ageB <= max;

            // статус: предполагаю, что это user.tag (READY / INTENSIVE_SEARCH)
            const statusKeyA = (a as any).tag;
            const statusKeyB = (b as any).tag;

            const inStatusA = status === "none" ? true : statusKeyA === status;
            const inStatusB = status === "none" ? true : statusKeyB === status;

            // город: точное совпадение по названию
            const cityA = a.location?.city?.toLowerCase() || "";
            const cityB = b.location?.city?.toLowerCase() || "";

            const inCityA = normalizedCity === "" ? true : cityA === normalizedCity;
            const inCityB = normalizedCity === "" ? true : cityB === normalizedCity;

            // тип встречи: предполагаю, что у пользователя есть массив meetIn: string[]
            const meetInA: string[] = (a as any).meetIn || [];
            const meetInB: string[] = (b as any).meetIn || [];

            const inMeetA = meetType === "none" ? true : meetInA.includes(meetType);
            const inMeetB = meetType === "none" ? true : meetInB.includes(meetType);

            // --- считаем "очки совпадения" ---

            const ageWeightA = ageRange === "none" ? 0 : (inAgeA ? 1 : 0);
            const ageWeightB = ageRange === "none" ? 0 : (inAgeB ? 1 : 0);

            const statusWeightA = status === "none" ? 0 : (inStatusA ? 1 : 0);
            const statusWeightB = status === "none" ? 0 : (inStatusB ? 1 : 0);

            const cityWeightA = normalizedCity === "" ? 0 : (inCityA ? 1 : 0);
            const cityWeightB = normalizedCity === "" ? 0 : (inCityB ? 1 : 0);

            const meetWeightA = meetType === "none" ? 0 : (inMeetA ? 1 : 0);
            const meetWeightB = meetType === "none" ? 0 : (inMeetB ? 1 : 0);

            const scoreA = ageWeightA + statusWeightA + cityWeightA + meetWeightA;
            const scoreB = ageWeightB + statusWeightB + cityWeightB + meetWeightB;

            // 1. Сначала те, кто набрал больше совпадений по фильтрам
            if (scoreA !== scoreB) return scoreB - scoreA;

            // 2. Внутри группы — по возрасту (моложе → старше)
            if (ageA !== ageB) return ageA - ageB;

            // 3. На всякий случай — по имени
            return (a.name || "").localeCompare(b.name || "");
        });
    }

    if (loading) {
        return (
            <LoadingView />
        );
    }

    return (
        <section className={styles.section}>
            <MeetSuggestions />

            <div className={styles.filters}>
                <label className={styles.filterLabel}>
                    <span>Возраст</span>
                    <Dropdown
                        source={ages}
                        current={form.age}
                        onChange={handleChangeAge}
                    />
                </label>
                <label className={styles.filterLabel}>
                    <span>Город</span>
                    <div className={styles.cityInputWrapper}>
                        <input
                            ref={cityInputRef}
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Город встречи"
                            value={form.city}
                            onChange={(e) => handleChangeCity(e.target.value)}
                            onFocus={handleCityInputFocus}
                            className={styles.filterInput}
                        />
                        {showCitySuggestions && filteredCities.length > 0 && (
                            <div ref={citySuggestionsRef} className={styles.citySuggestions}>
                                {filteredCities.map((city, index) => (
                                    <div
                                        key={index}
                                        className={styles.citySuggestionItem}
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            handleCitySelect(city);
                                        }}
                                    >
                                        {city}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </label>
                <label className={styles.filterLabel}>
                    <span>Статус</span>
                    <Dropdown
                        source={statuses}
                        current={form.status}
                        onChange={handleStatusChange}
                    />
                </label>
                <label className={styles.filterLabel}>
                    <span>Где встретиться</span>
                    <Dropdown
                        source={meetType}
                        current={form.meetType}
                        onChange={handleMeetTypeChange}
                    />
                </label>
            </div>
            <div className={styles.usersGrid}>
                {sortedUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        Пользователи не найдены
                    </div>
                ) : (
                    sortedUsers.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))
                )}
            </div>
        </section>
    )
}