"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/form",
        }, {
            onRequest: () => {
                setIsPending(true);
            },
            onSuccess: () => {
                setError("");
                setIsPending(false);
            },
            onError: (ctx) => {
                setError(ctx.error.message);
                setIsPending(false);
            },
        });
    };

    if (isPending) {
        return (
            <div className="flex justify-center" aria-label="読み込み中">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        <form className="container mx-auto p-4" onSubmit={handleSubmit}>
            <div className="mx-auto max-w-80 border border-slate-300 p-4 shadow-md">
                <p className="text-center mb-6">ユーザー登録</p>
                <p className="text-red-500">{error}</p>
                <label className="block mb-4">
                    <span>名前</span>
                    <input
                        type="text"
                        name="name"
                        className="px-2 py-1 w-full border border-slate-300 rounded-md shadow-md hover:border-slate-400"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={true}
                    />
                </label>
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
                    登録
                </button>
            </div>
        </form>
    );
};

export default SignUpPage;