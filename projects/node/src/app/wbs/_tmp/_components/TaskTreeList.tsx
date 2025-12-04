"use client";

import { useTaskTree } from "./TaskTreeProvider";
import { TaskStatus, TaskTree } from "./type";

type TaskTreeListProps = {
    node: TaskTree;
};

const TaskTreeList = ({
    node,
}: TaskTreeListProps) => {
    const { updateNode, addChild } = useTaskTree();
    const hasChildren = node.children && node.children.length > 0;

    const total = [
        node.value.plannedManHours,
        node.value.bufferedManHours,
    ].reduce((acc, value) => {
        if (Number.isNaN(parseInt(value))) {
            return acc;
        } else {
            return acc + Number(value);
        }
    }, 0);

    return (
        <>
            {hasChildren ? (
                <details>
                    <summary className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <input
                                className="w-full bg-gray-100"
                                value={node.value.name}
                                onChange={(e) => updateNode(
                                    node.value.id,
                                    (node) => ({
                                        ...node,
                                        value: {
                                            ...node.value,
                                            name: e.target.value,
                                        },
                                    }),
                                )}
                            />
                        </div>
                        <input
                            className="bg-gray-100"
                            value={node.value.worker}
                            onChange={(e) => updateNode(
                                node.value.id,
                                (node) => ({
                                    ...node,
                                    value: {
                                        ...node.value,
                                        worker: e.target.value,
                                    },
                                }),
                            )}
                        />
                        <select
                            className="bg-gray-100"
                            value={node.value.status}
                            onChange={(e) => updateNode(
                                node.value.id,
                                (node) => ({
                                    ...node,
                                    value: {
                                        ...node.value,
                                        status: e.target.value as TaskStatus,
                                    },
                                }),
                            )}
                        >
                            <option value="new">新規</option>
                            <option value="working">進行中</option>
                            <option value="completed">完了</option>
                        </select>
                        <input
                            className="bg-gray-100"
                            value={node.value.plannedManHours}
                            onChange={(e) => updateNode(
                                node.value.id,
                                (node) => ({
                                    ...node,
                                    value: {
                                        ...node.value,
                                        plannedManHours: e.target.value,
                                    },
                                }),
                            )}
                        />
                        <input
                            className="bg-gray-100"
                            value={node.value.bufferedManHours}
                            onChange={(e) => updateNode(
                                node.value.id,
                                (node) => ({
                                    ...node,
                                    value: {
                                        ...node.value,
                                        bufferedManHours: e.target.value,
                                    },
                                }),
                            )}
                        />
                        <input
                            className="bg-gray-100"
                            value={total}
                            readOnly={true}
                        />
                        <button
                            className="cursor-pointer"
                            onClick={() => addChild(node.value.id, {
                                value: {
                                    id: `${performance.now()}`,
                                    name: "",
                                    worker: "",
                                    status: "new",
                                    plannedManHours: "",
                                    bufferedManHours: "",
                                },
                            })}
                        >
                            +
                        </button>
                    </summary>
                    {node.children!.map((child) => (
                        <TaskTreeList key={child.value.id} node={child} />
                    ))}
                </details>
            ) : (
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                        <input
                            className="w-full bg-gray-100"
                            value={node.value.name}
                            onChange={(e) => updateNode(
                                node.value.id,
                                (node) => ({
                                    ...node,
                                    value: {
                                        ...node.value,
                                        name: e.target.value,
                                    },
                                }),
                            )}
                        />
                    </div>
                    <input
                        className="bg-gray-100"
                        value={node.value.worker}
                        onChange={(e) => updateNode(
                            node.value.id,
                            (node) => ({
                                ...node,
                                value: {
                                    ...node.value,
                                    worker: e.target.value,
                                },
                            }),
                        )}
                    />
                    <select
                        className="bg-gray-100"
                        value={node.value.status}
                        onChange={(e) => updateNode(
                            node.value.id,
                            (node) => ({
                                ...node,
                                value: {
                                    ...node.value,
                                    status: e.target.value as TaskStatus,
                                },
                            }),
                        )}
                    >
                        <option value="new">新規</option>
                        <option value="working">進行中</option>
                        <option value="completed">完了</option>
                    </select>
                    <input
                        className="bg-gray-100"
                        value={node.value.plannedManHours}
                        onChange={(e) => updateNode(
                            node.value.id,
                            (node) => ({
                                ...node,
                                value: {
                                    ...node.value,
                                    plannedManHours: e.target.value,
                                },
                            }),
                        )}
                    />
                    <input
                        className="bg-gray-100"
                        value={node.value.bufferedManHours}
                        onChange={(e) => updateNode(
                            node.value.id,
                            (node) => ({
                                ...node,
                                value: {
                                    ...node.value,
                                    bufferedManHours: e.target.value,
                                },
                            }),
                        )}
                    />
                    <input
                        className="bg-gray-100"
                        value={total}
                        readOnly={true}
                    />
                    <button
                        className="cursor-pointer"
                        onClick={() => addChild(node.value.id, {
                            value: {
                                id: `${performance.now()}`,
                                name: "",
                                worker: "",
                                status: "new",
                                plannedManHours: "",
                                bufferedManHours: "",
                            },
                        })}
                    >
                        +
                    </button>
                </div>
            )}
        </>
    );
};

export default TaskTreeList;