import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { db } from "@/db";
import { taskNodeSchema } from "@/app/wbs/_lib/schema";
import { WbsTask } from "@/app/wbs/_lib/types";
import { parseWbsTasks } from "@/app/wbs/_lib/utils";
import { wbs, wbsTasks } from "@/db/wbs-schema";
import { eq } from "drizzle-orm";

const paramsSchema = z.object({
    id: z.uuidv4(),
});

const bodySchema = z.object({
    name: z.string().nonempty(),
    nodes: taskNodeSchema,
});

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const parsedParams = paramsSchema.safeParse(await params);

    if (!parsedParams.success) {
        console.error(parsedParams.error);
        return NextResponse.json(
            { error: "不正なリクエスト" },
            { status: 400 },
        );
    }

    const wbsId = parsedParams.data.id;

    try {
        const wbsTasksResult = await db.select()
            .from(wbsTasks)
            .where(eq(wbsTasks.wbsId, wbsId));

        return NextResponse.json(
            { wbsTasks: wbsTasksResult },
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

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const parsedParams = paramsSchema.safeParse(await params);
    const parsedBody = bodySchema.safeParse(await req.json());

    if (!parsedParams.success || !parsedBody.success) {
        console.error(parsedParams.error);
        console.error(parsedBody.error);
        return NextResponse.json(
            { error: "不正なリクエスト" },
            { status: 400 },
        );
    }

    const wbsId = parsedParams.data.id;
    let tasks: WbsTask[] = [];
    parseWbsTasks(parsedBody.data.nodes, tasks, null);

    try {
        await db.transaction(async (tx) => {
            await tx.update(wbs)
                .set({ name: parsedBody.data.name })
                .where(eq(wbs.id, wbsId));

            await tx.delete(wbsTasks).where(eq(wbsTasks.wbsId, wbsId));

            await tx.insert(wbsTasks)
                .values(tasks.map((task) => ({
                    wbsId,
                    ...task,
                })));
        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update" },
            { status: 500 },
        );
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const parsedParams = paramsSchema.safeParse(await params);

    if (!parsedParams.success) {
        console.error(parsedParams.error);
        return NextResponse.json(
            { error: "不正なリクエスト" },
            { status: 400 },
        );
    }

    const wbsId = parsedParams.data.id;

    try {
        await db.transaction(async (tx) => {
            await tx.delete(wbsTasks).where(eq(wbsTasks.wbsId, wbsId));
            await tx.delete(wbs).where(eq(wbs.id, wbsId));
        });

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete" },
            { status: 500 },
        );
    }
};
