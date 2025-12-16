"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";

const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await authClient.signIn.email({
            email,
            password,
            callbackURL: "/form",
        });

        if (result.error) {
            setError(result.error.message || "ログインに失敗しました");
        }
    };

    return (
        <form className="container mx-auto p-4" onSubmit={handleSubmit}>
            <div className="mx-auto max-w-80 border border-slate-300 p-4 shadow-md">
                <p className="text-center mb-6">ログイン</p>
                <p className="text-red-500">{error}</p>
                <label className="block mb-4">
                    <span>メールアドレス</span>
                    <input
                        type="email"
                        name="email"
                        className="px-2 py-1 w-full border border-slate-300 rounded-md shadow-md hover:border-slate-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    />
                </label>
                <label className="block mb-6">
                    <span>パスワード</span>
                    <input
                        type="password"
                        name="password"
                        className="px-2 py-1 w-full border border-slate-300 rounded-md shadow-md hover:border-slate-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                    />
                </label>
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md hover:bg-gray-600 px-4 py-2 w-full"
                >
                    ログイン
                </button>
            </div>
        </form>
    );
};

export default SignInPage;