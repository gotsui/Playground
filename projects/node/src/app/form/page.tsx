import Link from "next/link";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { formsSchema } from "@/features/form/schemas/form";

const Page = async () => {
    const allForm = await db.select().from(forms).orderBy(desc(forms.updatedAt));
    const parsed = formsSchema.safeParse(allForm);

    return (
        <div className="flex flex-col p-4 space-y-4">
            {(parsed.data ?? []).map((form) => (
                <div key={form.id} className="flex space-x-4">
                    <Link href={`/form/${form.id}`}>
                        {form.name}
                    </Link>
                    <Link href={`/form/edit/${form.id}`}>
                        編集
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Page;