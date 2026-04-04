import { type NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import z from "zod";

import { taskNodeSchema } from "@/app/wbs/_lib/schema";
import { parseWbsTasks } from "@/app/wbs/_lib/utils";
import { db } from "@/db";
import { wbsTaskHistories, wbsTasks } from "@/db/wbs-schema";
import { getCurrentUserId } from "@/lib/auth/session";

const paramsSchema = z.object({
    id: z.uuidv4(),
});

const bodySchema = z.object({
    nodes: taskNodeSchema,
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
        const wbsTasksResult = await db.execute(sql`
            WITH RECURSIVE tmp AS (
                SELECT
                    *
                FROM
                    wbs_task_histories
                WHERE id = (
                    SELECT
                        id
                    FROM
                        wbs_task_histories
                    WHERE
                        parent_id IS NULL
                        AND task_id = ${taskId}
                    ORDER BY
                        created_at DESC
                    LIMIT 1
                )

                UNION ALL

                SELECT
                    his.*
                FROM
                    wbs_task_histories his
                INNER JOIN tmp
                    ON his.parent_id = tmp.id
            )
            SELECT
                id,
                parent_id as "parentId",
                logical_id as "logicalId",
                logical_parent_id as "logicalParentId",
                name,
                status,
                planned_effort as "plannedEffort",
                buffer,
                actual_effort as "actualEffort",
                assignee,
                start_date as "startDate",
                end_date as "endDate",
                notes
            FROM
                tmp
        `);

        return NextResponse.json(
            { wbsTasks: wbsTasksResult.rows },
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
        const taskResults = await db.select().from(wbsTasks).where(eq(wbsTasks.id, taskId));

        if (userId !== taskResults[0].createdBy) {
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

    const parsedWbsTasks = parseWbsTasks(parsedBody.data.nodes, null, null);

    try {
        await db.insert(wbsTaskHistories).values(parsedWbsTasks.map((task) => ({
            ...task,
            taskId,
            createdBy: userId,
        })));

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update" },
            { status: 500 },
        );
    }
};

export const DELETE = async (_: NextRequest, { params }: { params: { id: string } }) => {
    const userId = await getCurrentUserId();

    if (!userId) {
        return NextResponse.json(
            { error: "ログイン情報を取得できません"},
            { status: 401 },
        );
    }

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
        const taskResults = await db.select().from(wbsTasks).where(eq(wbsTasks.id, taskId));

        if (userId !== taskResults[0].createdBy) {
            return NextResponse.json(
                { error: "削除権限がありません" },
                { status: 403 },
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 },
        );
    }

    try {
        await db
            .update(wbsTasks)
            .set({
                deletedAt: new Date(),
                deletedBy: userId,
            })
            .where(eq(wbsTasks.id, taskId));

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 },
        );
    }
};
