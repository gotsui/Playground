import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "@/db";
import { users } from "@/db/auth-schema";
import { eq } from "drizzle-orm";

export const getCurrentUserId = async (): Promise<string | null> => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user.id || null;
};

export const getCurrentUser = async () => {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const results = await db.select().from(users).where(eq(users.id, userId));

    return results[0];
};