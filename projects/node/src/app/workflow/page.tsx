import Link from "next/link";
import { desc } from "drizzle-orm";

import { db } from "@/db";
import { approvalFlows } from "@/db/schema";
import { flowsSchema } from "@/features/workflow/schemas/workflow";
import { Plus } from "lucide-react";

const Page = async () => {
    const allFlow = await db.select().from(approvalFlows).orderBy(desc(approvalFlows.updatedAt));
    const parsed = flowsSchema.safeParse(allFlow);

    return (
        <div className="flex flex-col p-4 space-y-4">
            <div>
                <Link
                    href="/workflow/new"
                    className={[
                        "block size-10 p-2",
                        "bg-indigo-100 rounded-lg border-2 border-indigo-300",
                        "hover:border-indigo-400",
                    ].join(" ")}
                >
                    <Plus className="size-full" />
                </Link>
            </div>
            {(parsed.data ?? []).map((flow) => (
                <div key={flow.id} className="flex space-x-4">
                    <Link href={`/workflow/${flow.id}`}>
                        {flow.name}
                    </Link>
                    <Link href={`/workflow/edit/${flow.id}`}>
                        編集
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Page;