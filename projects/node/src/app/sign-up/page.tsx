"use client";

import { useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth/auth-client";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/sign-in",
        }, {
            onRequest: () => {
                setIsPending(true);
            },
            onSuccess: () => {
                setError("");
                setIsPending(false);
            },
            onError: (ctx) => {
                setError(ctx.error.message || "登録に失敗しました");
                setIsPending(false);
            },
        });
    };

    return (
        <div className="flex flex-col justify-center items-center p-8 space-y-4 w-full">
            <form
                className="w-80 p-4 border border-slate-300 rounded-md shadow-md"
                onSubmit={handleSubmit}
            >
                <div className="min-h-12 mb-2">
                    <p className="text-center">新規登録</p>
                    <p className="text-red-500">{error}</p>
                </div>
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
                <label className="block mb-8">
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
                    className={[
                        "px-4 py-2 w-full",
                        "bg-blue-500 text-white rounded-md",
                        "hover:bg-blue-600",
                        "disabled:bg-gray-500 disabled:cursor-not-allowed",
                    ].join(" ")}
                    disabled={isPending}
                >
                    {isPending ? (
                        <div className="flex justify-center" aria-label="読み込み中">
                            <div className="animate-spin h-6 w-6 border-4 border-white rounded-full border-t-transparent"></div>
                        </div>
                    ) : (
                        <span>新規登録</span>
                    )}
                </button>
            </form>
            <div className="w-80 flex justify-center space-x-2 p-2 border border-slate-300 rounded-md shadow-md">
                <p>登録済みの方は</p>
                <Link href="/sign-in" className="text-blue-500 hover:underline">こちらからログイン</Link>
            </div>
        </div>
    );
};

export default SignUpPage;