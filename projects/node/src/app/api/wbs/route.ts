import { type NextRequest, NextResponse } from "next/server";
import { and, eq, isNull, max } from "drizzle-orm";
import z from "zod";

import { taskNodeSchema } from "@/app/wbs/_lib/schema";
import type { WbsTask } from "@/app/wbs/_lib/types";
import { parseWbsTasks } from "@/app/wbs/_lib/utils";
import { db } from "@/db";
import { wbsTaskHistories, wbsTasks } from "@/db/wbs-schema";
import { getCurrentUserId } from "@/lib/auth/session";

const postSchema = z.object({
    nodes: taskNodeSchema,
});

export const GET = async (_: NextRequest) => {
    try {
        const latestIdSubquery = db
            .select({
                taskId: wbsTaskHistories.taskId,
                createdAt: max(wbsTaskHistories.createdAt).as("createdAt"),
            })
            .from(wbsTaskHistories)
            .groupBy(wbsTaskHistories.taskId)
            .as("latest_task_id");

        const latestRowSubquery = db
            .select({
                taskId: wbsTaskHistories.taskId,
                name: wbsTaskHistories.name,
            })
            .from(wbsTaskHistories)
            .rightJoin(latestIdSubquery, and(
                eq(wbsTaskHistories.taskId, latestIdSubquery.taskId),
                eq(wbsTaskHistories.createdAt, latestIdSubquery.createdAt),
            ))
            .where(isNull(wbsTaskHistories.parentId))
            .as("latest_task_row");

        const allWbs = await db
            .select({
                id: wbsTasks.id,
                name: latestRowSubquery.name,
                updatedAt: wbsTasks.createdAt,
            })
            .from(wbsTasks)
            .leftJoin(latestRowSubquery, eq(wbsTasks.id, latestRowSubquery.taskId))
            .where(isNull(wbsTasks.deletedAt))
            .orderBy(wbsTasks.createdAt);

        return NextResponse.json(
            { wbs: allWbs },
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

export const POST = async (req: NextRequest) => {
    const userId = await getCurrentUserId();

    if (!userId) {
        return NextResponse.json(
            { error: "ログイン情報を取得できません"},
            { status: 401 },
        );
    }

    const parsed = postSchema.safeParse(await req.json());

    if (!parsed.success) {
        console.error(parsed.error);
        return NextResponse.json(
            { error: "不正なリクエストです" },
            { status: 400 },
        );
    }

    const parsedWbsTasks: WbsTask[] = [];
    parseWbsTasks(parsed.data.nodes, parsedWbsTasks, null, null);

    try {
        const taskId = await db.transaction(async (tx) => {
            const wbsTasksResults = await tx.insert(wbsTasks).values({ createdBy: userId }).returning();
            const taskId = wbsTasksResults[0].id;
            await tx.insert(wbsTaskHistories).values(parsedWbsTasks.map((task) => ({
                ...task,
                taskId,
                createdBy: userId,
            })));
            return taskId;
        });

        return NextResponse.json(
            { wbsId: taskId },
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to save" },
            { status: 500 },
        );
    }
};
