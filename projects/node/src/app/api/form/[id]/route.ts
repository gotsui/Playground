import { NextRequest, NextResponse } from "next/server";
import z from "zod";

import { fieldsSchema } from "@/features/form/schemas/field";
import { idSchema } from "@/features/form/schemas/form";
import { db } from "@/db";
import { fields } from "@/db/schema";
import { eq } from "drizzle-orm";

const putSchema = z.object({
    id: idSchema,
    fields: fieldsSchema,
});

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id: formId } = await params;
    const { fields: updateFields } = await req.json();
    const parsed = putSchema.safeParse({ id: formId, fields: updateFields });

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 },
        );
    }

    try {
        await db.transaction(async (tx) => {
            await tx.delete(fields).where(eq(fields.formId, parsed.data.id));
            await tx.insert(fields).values((parsed.data.fields.map((field) => ({
                ...field,
                formId: parsed.data.id,
            }))));
        })

        return NextResponse.json(
            { status: 201 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error },
            { status: 500 },
        );
    }
};
