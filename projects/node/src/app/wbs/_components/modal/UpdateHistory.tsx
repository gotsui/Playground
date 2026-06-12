"use client";

import { useEffect, useState } from "react";
import { TaskHistoryNode } from "../../_lib/types";
import { wbsTaskHistoriesSchema } from "../../_lib/schema";
import { parseTaskHistoryNode } from "../../_lib/utils";
import { partition, trim } from "@/lib/array";
import { datetimeToString, dateToString } from "@/lib/date";

type Props = {
    wbsId: string;
};

const UpdateHistory = ({
    wbsId,
}: Props) => {
    const [taskNodes, setTaskNodes] = useState<TaskHistoryNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const res = await fetch(`/api/wbs/history/${wbsId}`);
            
            if (!res.ok) {
                console.error(await res.json());
                setIsLoading(false);
                return;
            }

            const { wbsTaskHistories } = await res.json();
            const parsedwbsTaskHistories = wbsTaskHistoriesSchema.safeParse(wbsTaskHistories);

            if (!parsedwbsTaskHistories.success) {
                console.error(parsedwbsTaskHistories.error);
                setIsLoading(false);
                return;
            }

            const [parents, children] = partition(
                parsedwbsTaskHistories.data,
                (task) => task.parentId === null,
            );
            const sortedParents = parents.sort((a, b) => a.createdAt.localeCompare(b.createdAt, 'ja'));
            const tasks = sortedParents.map((parent) => parseTaskHistoryNode(children.concat(parent)));
            setTaskNodes(trim(tasks));
            setIsLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div className="flex justify-center">
                    <div className="animate-ping h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
            ) : (
                <ul className="m-4">
                    {taskNodes.map((node) => (
                        <li
                            key={node.id}
                            className={[
                                "grid grid-cols-12 items-center",
                            ].join(" ")}
                        >
                            <div className="col-span-6">
                                {datetimeToString(node.createdAt)}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UpdateHistory;