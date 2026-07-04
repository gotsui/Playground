"use client";

import type { EditingRow, TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    editForm: EditingRow | null;
    updateForm: (updates: Partial<EditingRow>) => void;
    isEditing: boolean;
    isVisible : boolean;
};

const PlannedBuffer = ({
    node,
    editForm,
    updateForm,
    isEditing,
    isVisible,
}: Props) => {
    if (!isVisible) {
        return null;
    }

    if (node.children.length > 0) {
        return (
            <div className="flex-1 text-right">
                {node.totalBuffer} h
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="flex-1">
                <input
                    className="w-full border rounded-md px-2 py-1 text-right"
                    value={editForm?.buffer || ""}
                    onChange={(e) => updateForm({ buffer: e.target.value })}
                />
            </div>
        );
    } else {
        return (
            <div className="flex-1 text-right">
                {node.buffer} h
            </div>
        );
    }
};

export default PlannedBuffer;