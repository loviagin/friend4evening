import { avatars } from "@/models/Avatars"

type Props = {
    avatarUrl: string | undefined,
}

export default function Avatar({ avatarUrl }: Props) {
    return (
        <>
            {!avatarUrl ?
                <>
                    <img src={'/user.webp'} alt="Avatar"/>
                </>
                :
                (avatars.includes(avatarUrl) ?
                    <>
                        <img src={`/avatars/${avatarUrl}.png`} alt="Avatar"/>
                    </>
                    :
                    <>
                        <img src={avatarUrl} alt="Avatar"/>
                    </>
                )
            }
        </>
    );
}