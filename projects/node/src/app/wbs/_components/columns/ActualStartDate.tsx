"use client";

import { useRef } from "react";
import type { EditingRow, TaskWithCalc } from "../../_lib/types";

type Props = {
    node: TaskWithCalc;
    editForm: EditingRow | null;
    updateForm: (updates: Partial<EditingRow>) => void;
    isEditing: boolean;
    isVisible : boolean;
};

const ActualStartDate = ({
    node,
    editForm,
    updateForm,
    isEditing,
    isVisible,
}: Props) => {
    const actualStartDateRef = useRef<HTMLInputElement>(null);

    if (!isVisible) {
        return null;
    }

    if (isEditing) {
        return (
            <div className="flex-1 min-w-0">
                <button
                    type="button"
                    className="relative block min-h-7 w-full border rounded-md px-0 py-1"
                    onClick={() => actualStartDateRef.current?.showPicker()}
                >
                    <input
                        ref={actualStartDateRef}
                        type="date"
                        className="absolute invisible"
                        value={editForm?.actualStartDate}
                        onChange={(e) => updateForm({ actualStartDate: e.target.value })}
                    />
                    {editForm?.actualStartDate.replaceAll("-", "/") || ""}
                </button>
            </div>
        );
    } else {
        return (
            <div className="flex-1 text-center">
                {node.actualStartDate && (
                    <span className="text-gray-500 ml-2">
                        {node.actualStartDate?.toLocaleDateString("ja-JP", {
                            timeZone: "Asia/Tokyo",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        })}
                    </span>
                )}
            </div>
        );
    }
};

export default ActualStartDate;