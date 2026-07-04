"use client";

import { ChevronDown, ChevronRight, Dot } from "lucide-react";
import type { EditingRow, TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    depth: number;
    isEditing: boolean;
    editForm: EditingRow | null;
    expanded: Set<string>;
    updateForm: (updates: Partial<EditingRow>) => void;
    toggleExpand: (id: string) => void;
};

const TaskName = ({
    node,
    depth,
    isEditing,
    editForm,
    expanded,
    updateForm,
    toggleExpand,
}: Props) => {
    const isExpanded = expanded.has(node.id);
    const hasChildren = node.children.length > 0;
    const paddingLeft = depth * 24;

    if (isEditing) {
        return (
            <div className="flex-4 flex items-center">
                {hasChildren ? (
                    <div
                        className="p-1 ml-1"
                        style={{ paddingLeft: `${paddingLeft}px` }}
                    >
                        {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                    </div>
                ) : (
                    <div
                        style={{ paddingLeft: `${paddingLeft}px` }}
                    >
                        <Dot className="size-7" />
                    </div>
                )}
                <input
                    className="w-full border rounded-md px-2 py-1"
                    value={editForm?.name || ""}
                    onChange={(e) => updateForm({ name: e.target.value })}
                />
            </div>
        );
    } else {
        return (
            <div className="flex-4 flex items-center">
                {hasChildren ? (
                    <button
                        type="button"
                        className="p-1 ml-1 cursor-pointer"
                        onClick={() => toggleExpand(node.id)}
                        style={{ paddingLeft: `${paddingLeft}px` }}
                    >
                        {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                    </button>
                ) : (
                    <div
                        style={{ paddingLeft: `${paddingLeft}px` }}
                    >
                        <Dot className="size-7" />
                    </div>
                )}
                <span className="font-medium">{node.name}</span>
            </div>
        );
    }
};

export default TaskName;