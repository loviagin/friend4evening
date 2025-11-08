
import UserProfilePage from './components/UserProfilePage/UserProfilePage';

export async function generateStaticParams() {
    const base = process.env.NEXT_PUBLIC_URL!;
    const response = await fetch(`${base}/api/users/nicknames`);
    const data = await response.json();
    const nicknames = data["nicknames"];
    return (nicknames as string[])
        .filter(n => typeof n === "string" && n.length > 0)
        .map(nickname => ({ nickname }));
}

export default async function UserProfile({ params }: { params: Promise<{ nickname: string }> }) {
    const { nickname } = await params;

    if (!nickname) {
        return (
            <main>
                Пользователь не найден
            </main>
        )
    }

    return (
        <main>
            <h1>Профиль</h1>
            <hr />
            <UserProfilePage nickname={nickname} />
        </main>
    )
}