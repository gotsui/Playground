"use client";

import type { EditingRow, TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    editForm: EditingRow | null;
    updateForm: (updates: Partial<EditingRow>) => void;
    isEditing: boolean;
    isVisible : boolean;
};

const TaskStatus = ({
    node,
    editForm,
    updateForm,
    isEditing,
    isVisible,
}: Props) => {
    if (!isVisible) {
        return null;
    }

    if (isEditing) {
        return (
            <div className="flex-1">
                <select
                    className="w-full border rounded-md px-2 py-1.5"
                    value={editForm?.status || "新規"}
                    onChange={(e) => updateForm({ status: e.target.value })}
                >
                    <option>新規</option>
                    <option>進行中</option>
                    <option>完了</option>
                </select>
            </div>
        );
    } else {
        return (
            <div className="flex-1 text-center">
                <span className={`inline-block w-4/5 text-center text-nowrap py-0.5 rounded-md ${
                    node.status === "完了" ? "bg-green-100 text-green-800" :
                    node.status === "進行中" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-600"
                }`}>
                    {node.status}
                </span>
            </div>
        );
    }
};

export default TaskStatus;