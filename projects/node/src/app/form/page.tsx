import Link from "next/link";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { formsSchema } from "@/features/form/schemas/form";

const Page = async () => {
    const allForm = await db.select().from(forms).orderBy(desc(forms.updatedAt));
    const parsed = formsSchema.safeParse(allForm);

    return (
        <div className="flex flex-col">
            {(parsed.data ?? []).map((form) => (
                <Link key={form.id} href={`/form/edit/${form.id}`}>
                    {form.name}
                </Link>
            ))}
        </div>
    );
};

export default Page;