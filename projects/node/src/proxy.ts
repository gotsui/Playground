import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "./lib/auth/auth";

const publicPaths = [
    "/sign-in",
    "/sign-up",
    "/api/auth",
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
];

export const proxy = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    // 認証が不要なルートをスキップ
    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // セッション確認
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
};
