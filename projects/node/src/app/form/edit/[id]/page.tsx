import { eq } from "drizzle-orm";

import { db } from "@/db";
import { fields } from "@/db/schema";
import { fieldsSchema } from "@/features/form/schemas/field";
import FormEditor from "@/features/form/components/FormEditor";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
    const { id } = await params;
    const result = await db.select().from(fields).where(eq(fields.formId, id));
    const parsed = fieldsSchema.safeParse(result);

    return (
        <FormEditor defaultFields={parsed.data ?? []} />
    );
};

export default Page;