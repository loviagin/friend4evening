"use client";

import { User } from "@/models/User";
import Avatar from "@/components/Avatar/Avatar";
import Link from "next/link";
import styles from "./InviteUserCard.module.css";

export default function InviteUserCard({ 
    user, 
    onInvite, 
    loading 
}: { 
    user: User, 
    onInvite: () => void, 
    loading: boolean 
}) {
    return (
        <div className={styles.card}>
            <Link href={`/profile/${user.nickname}`} target="_blank" className={styles.userLink}>
                <div className={styles.avatar}>
                    <Avatar avatarUrl={user.avatarUrl} />
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.name}>
                        {user.name}
                    </div>
                    <div className={styles.nickname}>
                        @{user.nickname}
                    </div>
                </div>
            </Link>
            <button
                className={styles.inviteButton}
                onClick={onInvite}
                disabled={loading}
            >
                {loading ? 'Приглашение...' : 'Пригласить'}
            </button>
        </div>
    );
}
