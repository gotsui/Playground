import { NextRequest, NextResponse } from "next/server";

import z from "zod";
import { db } from "@/db";
import { taskNodeSchema } from "@/app/wbs/_lib/schema";

const postSchema = z.object({
    name: z.string().nonempty(),
    nodes: taskNodeSchema,
});

export const GET = async (_: NextRequest) => {
    try {
        const allWbs = await db.select();

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



    try {
        const wbsId = await db.transaction(async (tx) => {

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
