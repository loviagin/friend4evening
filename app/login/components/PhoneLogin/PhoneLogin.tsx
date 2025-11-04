"use client";

import { auth } from "@/lib/firebase";
import { RecaptchaVerifier } from "firebase/auth";

export default function PhoneLogin() {

    const handlePhoneLogin = () => {
        
    };

    return (
        <button onClick={handlePhoneLogin}>Войти по номеру телефона</button>
    );
}