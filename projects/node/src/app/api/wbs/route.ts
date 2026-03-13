import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import z from "zod";

import { taskNodeSchema } from "@/app/wbs/_lib/schema";
import { db } from "@/db";
import { wbs, wbsTasks } from "@/db/wbs-schema";
import { WbsTask } from "@/app/wbs/_lib/types";
import { parseWbsTasks } from "@/app/wbs/_lib/utils";

const postSchema = z.object({
    name: z.string().nonempty(),
    nodes: taskNodeSchema,
});

export const GET = async (_: NextRequest) => {
    try {
        const allWbs = await db.select().from(wbs).orderBy(desc(wbs.updatedAt));

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
    const parsed = postSchema.safeParse(await req.json());

    if (!parsed.success) {
        console.error(parsed.error);
        return NextResponse.json(
            { error: "不正なリクエストです" },
            { status: 400 },
        );
    }

    let tasks: WbsTask[] = [];
    parseWbsTasks(parsed.data.nodes, tasks, null);

    try {
        const wbsId = await db.transaction(async (tx) => {
            const wbsResults = await tx.insert(wbs).values({ name: parsed.data.name }).returning();
            const wbsId = wbsResults[0].id;
            await tx.insert(wbsTasks).values(tasks.map((task) => ({
                wbsId,
                ...task,
            })));
            return wbsId;
        });

        return NextResponse.json(
            { wbsId },
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
