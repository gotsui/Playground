"use client";

import type { EditingRow, TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    editForm: EditingRow | null;
    updateForm: (updates: Partial<EditingRow>) => void;
    isEditing: boolean;
    isVisible : boolean;
};

const TaskAssignee = ({
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
                <input
                    className="w-full border rounded-md px-2 py-1"
                    value={editForm?.assignee || ""}
                    onChange={(e) => updateForm({ assignee: e.target.value })}
                />
            </div>
        );
    } else {
        return (
            <div className="flex-1 text-center">
                {node.assignee && <span className="text-gray-500 ml-2">{node.assignee}</span>}
            </div>
        );
    }
};

export default TaskAssignee;