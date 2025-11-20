"use client";

import Avatar from "@/components/Avatar/Avatar";
import Dropdown from "@/components/Dropdown/Dropdown";
import { tags, User } from "@/models/User";
import { useEffect, useState } from "react";
import styles from "./Meets.module.css";
import Link from "next/link";
import { AiFillCar } from "react-icons/ai";

const ages: { key: string, label: string }[] = [
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

function sortUsers(
    users: User[],
    ageRange: string,   // "none" | "18-22" | ...
    status: string      // "none" | "READY" | "INTENSIVE_SEARCH"
): User[] {
    // если фильтров нет — просто возвращаем копию списка
    if (ageRange === "none" && status === "none") {
        return [...users];
    }

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

    const copy = [...users];

    return copy.sort((a, b) => {
        const ageA = calcAge(a.birthday);
        const ageB = calcAge(b.birthday);

        const inAgeA =
            ageRange === "none" ? true : ageA >= min && ageA <= max;
        const inAgeB =
            ageRange === "none" ? true : ageB >= min && ageB <= max;

        // тут поле статуса подгони под свою модель:
        // например, user.statusKey или user.status или user.searchStatus
        const statusA = (a as any).statusKey || (a as any).tag || (a as any).searchStatus;
        const statusB = (b as any).statusKey || (b as any).tag || (b as any).searchStatus;

        const inStatusA = status === "none" ? true : statusA === status;
        const inStatusB = status === "none" ? true : statusB === status;

        // 1. Ранг: 0 — и возраст попал, и статус попал; 1 — остальные
        const rankA = inAgeA && inStatusA ? 0 : 1;
        const rankB = inAgeB && inStatusB ? 0 : 1;

        if (rankA !== rankB) return rankA - rankB;

        // 2. Внутри групп сортируем по возрасту (моложе → старше)
        if (ageA !== ageB) return ageA - ageB;

        // 3. На всякий случай — по имени, чтобы порядок был стабильнее
        return (a.name || "").localeCompare(b.name || "");
    });
}

export default function Meets() {
    const [users, setUsers] = useState<User[]>([]);
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);
    const [age, setAge] = useState<string>("none");
    const [status, setStatus] = useState<string>("none");

    useEffect(() => {
        const fetchUsers = async () => {
            const resp = await fetch('/api/users');
            const data = await resp.json()

            if (resp.status === 200) {
                const users = data['users'] as User[]
                console.log(users);
                setUsers(users);
                setSortedUsers(users);
            }
        }

        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters(age, status);
    }, [users]);

    const pluralizeYears = (age: number) => {
        const mod10 = age % 10;
        const mod100 = age % 100;

        if (mod100 >= 11 && mod100 <= 14) return "лет";
        if (mod10 === 1) return "год";
        if (mod10 >= 2 && mod10 <= 4) return "года";
        return "лет";
    };

    const userAge = (user: User) => {
        if (user?.showBirthday && user.birthday) {
            const birthday = new Date(user.birthday);
            if (isNaN(birthday.getTime())) return;

            const today = new Date();
            let age = today.getFullYear() - birthday.getFullYear();
            const m = today.getMonth() - birthday.getMonth();

            if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
                age--;
            }

            return ` • ${age} ${pluralizeYears(age)}`;
        }
    };

    const applyFilters = (ageValue: string, statusValue: string) => {
        const sorted = sortUsers(users, ageValue, statusValue);
        setSortedUsers(sorted);
    };

    const handleChangeAge = (newAge: string) => {
        setAge(newAge);
        applyFilters(newAge, status);
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        applyFilters(age, newStatus);
    };

    return (
        <section className={styles.section}>
            <div className={styles.filters}>
                <label className={styles.filterLabel}>
                    <span>Возраст</span>
                    <Dropdown
                        source={ages}
                        current={age}
                        onChange={handleChangeAge}
                    />
                </label>
                <label className={styles.filterLabel}>
                    <span>Статус</span>
                    <Dropdown
                        source={statuses}
                        current={status}
                        onChange={handleStatusChange}
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
                        <div key={user.id} className={styles.userCard}>
                            <Link href={`/profile/${user.nickname}`} target="_blank">
                                <div className={styles.userHeader}>
                                    <div className={styles.userAvatarWrapper}>
                                        <Avatar avatarUrl={user.avatarUrl} />
                                        {user.tag && (
                                            <span className={styles.userTag}>{tags.find(s => s.key === user.tag)?.label}</span>
                                        )}
                                    </div>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>
                                            {user.name}
                                            {userAge(user)}
                                        </div>
                                        {user.location?.city && (
                                            <div className={styles.userLocation}>
                                                🌆 {user.location.city} {user.readyToTrip === true && (
                                                    <span className={styles.carIcon} title="готов к поездке">
                                                        <AiFillCar />
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className={styles.userNickname}>
                                            @{user.nickname}
                                        </div>
                                    </div>
                                </div>
                                {user.bio && (
                                    <p className={styles.userBio}>
                                        {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
                                    </p>
                                )}
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}