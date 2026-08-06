import { db } from "@/db";
import { fields } from "@/db/schema";
import FormBuilder from "@/features/form/components/FormBuilder";
import { formElementsSchema } from "@/features/form/schemas/formElement";
import { idSchema } from "@/features/form/schemas/form";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
    const { id } = await params;
    const parsedParams = idSchema.safeParse(id);

    if (!parsedParams.success) {
        notFound();
    }

    const result = await db.select().from(fields).where(eq(fields.formId, parsedParams.data));
    const parsedFields = formElementsSchema.safeParse(result);

    return (
        <FormBuilder elements={parsedFields.data ?? []} />
    );
};

export default Page;