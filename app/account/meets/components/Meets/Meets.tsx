"use client";

import Avatar from "@/components/Avatar/Avatar";
import Dropdown from "@/components/Dropdown/Dropdown";
import { tags, User } from "@/models/User";
import { useEffect, useState } from "react";
import styles from "./Meets.module.css";

const ages: { key: string, label: string }[] = [
    { key: "none", label: "Не важно" },
    { key: "18-22", label: "18 – 22" },
    { key: "23-27", label: "23 – 27" },
    { key: "28-35", label: "28 – 35" },
    { key: "36-45", label: "36 – 45" },
    { key: "46-60", label: "46 – 60" },
    { key: "60", label: "60 +" },
]

function sortUsersByAgeRange(users: User[], range: string): User[] {
  if (range === "none") return [...users];

  const [minStr, maxStr] = range.split("-");
  const min = Number(minStr);
  const max = maxStr ? Number(maxStr) : Infinity; // для "60" → 60+

  const calcAge = (birthday: Date | string | null | undefined) => {
    if (!birthday) return Infinity; // у кого нет даты – в конец списка

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

  // Не мутируем исходный массив
  const copy = [...users];

  return copy.sort((a, b) => {
    const ageA = calcAge(a.birthday);
    const ageB = calcAge(b.birthday);

    const inRangeA = ageA >= min && ageA <= max;
    const inRangeB = ageB >= min && ageB <= max;

    // 1. Сначала те, кто в диапазоне
    if (inRangeA && !inRangeB) return -1;
    if (!inRangeA && inRangeB) return 1;

    // 2. Внутри групп сортируем по возрасту (моложе → старше)
    return ageA - ageB;
  });
}

export default function Meets() {
    const [users, setUsers] = useState<User[]>([]);
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);
    const [age, setAge] = useState<string>("none");

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
    }, [])

    const handleChangeAge = (newAge: string) => {
        if (newAge === "none") {
            setSortedUsers(users);
        } else {
            setSortedUsers(sortUsersByAgeRange(users, newAge));
        }
        console.log(newAge)
        setAge(newAge);
    }

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
            </div>
            <div className={styles.usersGrid}>
                {sortedUsers.length === 0 ? (
                    <div className={styles.emptyState}>
                        Пользователи не найдены
                    </div>
                ) : (
                    sortedUsers.map((user) => (
                        <div key={user.id} className={styles.userCard}>
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
                                            🌆 {user.location.city}
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
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}