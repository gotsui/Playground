import { type NextRequest, NextResponse } from "next/server";
import z from "zod";
import { asc } from "drizzle-orm";

import { formElementsSchema } from "@/features/form/schemas/formElement";
import { nameSchema } from "@/features/form/schemas/form";
import { db } from "@/db";
import { fields, forms } from "@/db/schema";

const postSchema = z.object({
    name: nameSchema,
    fields: formElementsSchema,
});

export const GET = async (_: NextRequest) => {
    try {
        const allForm = await db.select().from(forms).orderBy(asc(forms.name));

        return NextResponse.json(
            { forms: allForm },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 },
        );
    }
};

export const POST = async (req: NextRequest) => {
    const parsed = postSchema.safeParse(await req.json());

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Bad Request" },
            { status: 400 },
        );
    }

    try {
        const formId = await db.transaction(async (tx) => {
            const result = await tx.insert(forms).values({ name: parsed.data.name }).returning();
            const formId = result[0].id;

            await tx.insert(fields).values(parsed.data.fields.map((field) => ({
                id: field.id,
                formId,
                name: field.name,
                rect: field.rect,
                data: field.data,
                type: field.type,
            })));

            return formId;
        });

        return NextResponse.json(
            { id: formId },
            { status: 201 },
        );
    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 },
        );
    }
};
