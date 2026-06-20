import { type NextRequest, NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";

import { db } from "@/db";
import { wbsTaskMembers } from "@/db/wbs-schema";
import { users } from "@/db/auth-schema";
import { getCurrentUserId } from "@/lib/auth/session";
import { wbsMembersSchema } from "@/app/wbs/_lib/schema";

const paramsSchema = z.object({
    id: z.uuidv4(),
});

const bodySchema = z.object({
    members: wbsMembersSchema,
});

export const GET = async (_: NextRequest, { params }: { params: { id: string } }) => {
    const parsedParams = paramsSchema.safeParse(await params);

    if (!parsedParams.success) {
        console.error(parsedParams.error);
        return NextResponse.json(
            { error: "不正なリクエスト" },
            { status: 400 },
        );
    }

    const taskId = parsedParams.data.id;

    try {
        const usersResult = await db.select().from(users);

        console.log(usersResult);

        const membersResult = await db
            .select({
                id: wbsTaskMembers.id,
                userId: users.id,
                userName: users.name,
                role: wbsTaskMembers.role, 
            })
            .from(wbsTaskMembers)
            .leftJoin(users, eq(wbsTaskMembers.userId, users.id))
            .where(eq(wbsTaskMembers.taskId, taskId));

        console.log(membersResult);

        return NextResponse.json(
            {
                users: usersResult,
                members: membersResult,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch" },
            { status: 500 },
        );
    }
};

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const userId = await getCurrentUserId();

    if (!userId) {
        console.log("ログイン情報取得エラー");
        return NextResponse.json(
            { error: "ログイン情報を取得できません"},
            { status: 401 },
        );
    }

    const parsedParams = paramsSchema.safeParse(await params);
    const parsedBody = bodySchema.safeParse(await req.json());

    if (!parsedParams.success || !parsedBody.success) {
        console.error(parsedParams.error);
        console.error(parsedBody.error);
        return NextResponse.json(
            { error: "不正なリクエストです" },
            { status: 400 },
        );
    }

    const taskId = parsedParams.data.id;

    try {
        const roleResult = await db
            .select()
            .from(wbsTaskMembers)
            .where(and(
                eq(wbsTaskMembers.taskId, taskId),
                eq(wbsTaskMembers.userId, userId),
            ));

        if (roleResult.length === 0) {
            console.log("編集権限エラー", "ロール設定なし");
            return NextResponse.json(
                { error: "編集権限がありません" },
                { status: 403 },
            );
        } else if (roleResult[0].role !== "owner" && roleResult[0].role !== "admin") {
            console.log("編集権限エラー", roleResult[0].role);
            return NextResponse.json(
                { error: "編集権限がありません" },
                { status: 403 },
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update" },
            { status: 500 },
        );
    }

    try {
        await db
            .insert(wbsTaskMembers)
            .values(parsedBody.data.members.map((member) => ({
                id: member.id,
                taskId,
                userId: member.userId,
                role: member.role,
                createdBy: userId,
            })))
            .onConflictDoUpdate({
                set: {
                    role: sql`EXCLUDED.role`,
                },
                target: wbsTaskMembers.id,
            })

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update" },
            { status: 500 },
        );
    }
};
