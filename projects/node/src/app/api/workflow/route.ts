import { db } from "@/db";
import { approvalFlows, approvalProcesses } from "@/db/schema";
import { processesSchema } from "@/features/workflow/schemas/process";
import { idSchema, nameSchema } from "@/features/workflow/schemas/workflow";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const postSchema = z.object({
    name: nameSchema,
    processes: processesSchema,
    formId: idSchema,
});

export const POST = async (req: NextRequest) => {
    const parsed = postSchema.safeParse(await req.json());

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 },
        );
    }

    try {
        const flowId = await db.transaction(async (tx) => {
            const result = await tx.insert(approvalFlows).values({ name: parsed.data.name }).returning();
            const flowId = result[0].id;

            await tx.insert(approvalProcesses).values(parsed.data.processes.map((process) => ({
                id: process.id,
                approvalFlowId: flowId,
                name: process.name,
                step: process.step,
                priority: process.priority,
                type: process.type,
            })));

            return flowId;
        });

        return NextResponse.json(
            { id: flowId },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 },
        );
    }
};