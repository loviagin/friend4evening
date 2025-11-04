"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

type Props = {
    onComplete: (userId: string | null, error: string | null) => void;
}

export default function GoogleLogin({ onComplete }: Props) {

    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

                onComplete(user.uid, null);
            })
            .catch((error) => {
                const errorMessage = error.message;
                onComplete(null, errorMessage);
            });
    };

    return (
        <button onClick={handleGoogleLogin}>Войти через Google</button>
    )
}