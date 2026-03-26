import Link from "next/link";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { forms } from "@/db/schema";
import { formsSchema } from "@/features/form/schemas/form";
import { ArrowLeft, Plus } from "lucide-react";

const Page = async () => {
    const allForm = await db.select().from(forms).orderBy(desc(forms.updatedAt));
    const parsed = formsSchema.safeParse(allForm);

    return (
        <div className="flex flex-col p-4 space-y-4">
            <div className="flex items-center gap-8 p-4">
                <Link href={"/"}>
                    <ArrowLeft />
                </Link>
                <div className="text-2xl">フォーム</div>
                <Link
                    href="/form/new"
                    className={[
                        "block size-10 p-2",
                        "bg-indigo-100 rounded-lg border-2 border-indigo-300",
                        "hover:border-indigo-400",
                    ].join(" ")}
                >
                    <Plus className="size-full" />
                </Link>
            </div>
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