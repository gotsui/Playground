"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/auth-client";

const NavText = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="relative flex items-center h-full group hover:text-(--color-header-hover)">
            {children}
            <div className="absolute bottom-0 h-1 w-full group-hover:bg-(--color-header-hover) transition duration-300" />
        </div>
    );
};

const NavBar = () => {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const handleClickSignOut = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };

    return (
        <nav className="h-10 bg-(--color-header-bg) text-(--color-header-text)">
            <div className="h-full container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    <Link href="/">ツール</Link>
                </div>
                <div className="flex h-full space-x-4 items-center">
                    {isPending ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <Link href="/" className="h-full">
                                <NavText>ホーム</NavText>
                            </Link>
                            {session ? (
                                <>
                                    <p>ユーザー名：{session.user.name}</p>
                                    <button className="h-full" onClick={handleClickSignOut}>
                                        <NavText>ログアウト</NavText>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/sign-in" className="h-full">
                                        <NavText>ログイン</NavText>
                                    </Link>
                                    <Link href="/sign-up" className="h-full">
                                        <NavText>新規登録</NavText>
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;