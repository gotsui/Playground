import { eq } from "drizzle-orm";

import { db } from "@/db";
import { approvalProcesses } from "@/db/schema";
import WorkflowEditor from "@/features/workflow/components/WorkflowEditor";
import { processesSchema } from "@/features/workflow/schemas/process";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
    const { id } = await params;
    const result = await db.select()
        .from(approvalProcesses)
        .where(eq(approvalProcesses.approvalFlowId, id));
    const parsed = processesSchema.safeParse(result);

    return (
        <WorkflowEditor defaultProcesses={parsed.data ?? []} />
    );
};

export default Page;