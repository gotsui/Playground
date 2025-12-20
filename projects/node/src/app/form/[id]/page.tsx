import { db } from "@/db";
import { idSchema } from "@/features/form/schemas/form";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

const Page = async ({ params }: Props) => {
    const { id } = await params;
    const parsed = idSchema.safeParse(id);

    if (!parsed.success) {
        notFound();
    }

    // const result = await db.select().from()
};

export default Page;