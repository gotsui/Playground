"use client";

import { useEffect, useState } from "react";
import type { TaskHistoryNode } from "../../_lib/types";
import { wbsTaskHistoriesSchema } from "../../_lib/schema";
import { diffNodes, parseTaskHistoryNode } from "../../_lib/utils";
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
            if (!wbsId) {
                return;
            }

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
    }, [wbsId]);

    const sss = (nodes: TaskHistoryNode[]): Map<string, string> => {
        if (nodes.length === 0) {
            return new Map();
        }

        const sss: Map<string, string> = new Map();
        let previousNode: TaskHistoryNode = nodes[0];

        for (let i = 0; i < nodes.length; i++) {
            const currentNode = nodes[i];

            if (i === 0) {
                sss.set(crypto.randomUUID(), datetimeToString(currentNode.createdAt))
                sss.set(crypto.randomUUID(), "+++ 新規作成");
            }

            const diff = diffNodes(previousNode, currentNode);

            if (diff.removedNodePathList.length > 0 || diff.addedNodePathList.length > 0 || diff.updatedFields.length > 0) {
                sss.set(crypto.randomUUID(), datetimeToString(currentNode.createdAt));
                
                if (diff.removedNodePathList.length > 0) {
                    sss.set(crypto.randomUUID(), "+++ 削除");
                    diff.removedNodePathList.forEach((path) => {
                        sss.set(crypto.randomUUID(), `+++++++ ${path.join("/")}`);
                    });
                }

                if (diff.addedNodePathList.length > 0) {
                    sss.set(crypto.randomUUID(), "+++ 追加");
                    diff.addedNodePathList.forEach((path) => {
                        sss.set(crypto.randomUUID(), `+++++++ ${path.join("/")}`);
                    });
                }

                if (diff.updatedFields.length) {
                    sss.set(crypto.randomUUID(), "+++ 更新");

                    for (const updateField of diff.updatedFields) {
                        sss.set(crypto.randomUUID(), updateField.path.join("/"));

                        for (const field of updateField.fields) {
                            const before = field.before instanceof Date ? dateToString(field.before) : field.before?.toString() || "";
                            const after = field.after instanceof Date ? dateToString(field.after) : field.after?.toString() || "";

                            sss.set(crypto.randomUUID(), field.key);
                            sss.set(crypto.randomUUID(), `"+++++++ ${before} → ${after}`);
                        }
                    }
                }
            }

            previousNode = currentNode;
        }

        return sss;
    };

    return (
        <div>
            {isLoading ? (
                <div className="flex justify-center">
                    <div className="animate-ping h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
            ) : (
                <ul className="m-4">
                    {Array.from(sss(taskNodes)).map(([key, value]) => (
                        <li key={key}>
                            {value}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UpdateHistory;