"use client";

import type { EditingRow, TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    editForm: EditingRow | null;
    updateForm: (updates: Partial<EditingRow>) => void;
    isEditing: boolean;
    isVisible : boolean;
};

const ActualEffort = ({
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
                    className="w-full border rounded-md px-2 py-1 text-right"
                    value={editForm?.actualEffort || ""}
                    onChange={(e) => updateForm({ actualEffort: e.target.value })}
                />
            </div>
        );
    } else {
        return (
            <div className="flex-1 text-right">
                {node.actualEffort} h
            </div>
        );
    }
};

export default ActualEffort;