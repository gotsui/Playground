"use client";

import { useEffect, useState } from "react";
import { forbidden, notFound, useParams } from "next/navigation";

import WbsLayout from "../_components/WbsLayout";
import { wbsRoleSchema, wbsTasksSchema } from "../_lib/schema";
import type { WbsRole, TaskNode } from "../_lib/types";
import { parseTaskNode } from "../_lib/utils";

const WbsPage = () => {
    const { id } = useParams();
    const wbsId = Array.isArray(id) ? id[0] : id;
    const [taskNode, setTastNode] = useState<TaskNode | null>(null);
    const [role, setRole] = useState<WbsRole | null>(null);
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

            const { wbsTasks, role } = await res.json();
            const parsedWbsTasks = wbsTasksSchema.safeParse(wbsTasks);
            const parsedRole = wbsRoleSchema.safeParse(role);

            if (parsedWbsTasks.success) {
                const node = parseTaskNode(parsedWbsTasks.data);
                setTastNode(node);
            } else {
                console.error(parsedWbsTasks.error);
            }

            if (parsedRole.success) {
                setRole(parsedRole.data);
            } else {
                console.error(parsedRole.error);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [wbsId]);

    if (isLoading) {
        return (
            <div className="flex justify-center mt-8">
                <div className="animate-ping h-4 w-4 bg-blue-600 rounded-full"></div>
            </div>
        );
    }

    if (!taskNode) {
        notFound();
    }

    if (!role) {
        forbidden();
    }

    return (
        <WbsLayout initialTaskNode={taskNode} wbsRole={role} />
    );
};

export default WbsPage;