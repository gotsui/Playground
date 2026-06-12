import { type NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

import { db } from "@/db";
import { wbsTaskHistories } from "@/db/wbs-schema";

const paramsSchema = z.object({
    id: z.uuidv4(),
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
        const wbsTaskHistoriesResult = await db
            .select()
            .from(wbsTaskHistories)
            .where(and(
                eq(wbsTaskHistories.taskId, taskId),
            ));

        console.log(wbsTaskHistoriesResult);

        return NextResponse.json(
            { wbsTaskHistories: wbsTaskHistoriesResult },
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
