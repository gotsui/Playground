"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

import WbsLayout from "../_components/WbsLayout";
import { TaskNode } from "../_lib/types";
import { wbsTasksSchema } from "../_lib/schema";
import { parseTaskNode } from "../_lib/utils";

const WbsPage = () => {
    const { id } = useParams();
    const wbsId = Array.isArray(id) ? id[0] : id;
    const [taskNode, setTastNode] = useState<TaskNode | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    if (!wbsId) {
        notFound();
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const res = await fetch(`/api/wbs/${wbsId}`);

            if (!res.ok) {
                console.error(await res.json());
                setIsLoading(false);
                return;
            }

            const { wbsTasks } = await res.json();
            const parsedWbsTasks = wbsTasksSchema.safeParse(wbsTasks);

            if (parsedWbsTasks.success) {
                const node = parseTaskNode(parsedWbsTasks.data);
                setTastNode(node);
            } else {
                console.error(parsedWbsTasks.error);
            }

            setIsLoading(false);
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center" aria-label="読み込み中">
                <div className="animate-ping h-4 w-4 bg-blue-600 rounded-full"></div>
            </div>
        );
    }

    if (!taskNode) {
        notFound();
    }

    return (
        <WbsLayout initialTaskNode={taskNode} />
    );
};

export default WbsPage;