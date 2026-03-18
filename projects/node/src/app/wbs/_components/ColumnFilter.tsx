"use client";

import { useState } from "react";
import { Eye } from "lucide-react";

import Checkbox from "./Checkbox";
import { ColumnFilterKey } from "../_lib/types";

type Props = {
    hiddenColumnSet: Set<ColumnFilterKey>;
    setHiddenColumnSet: React.Dispatch<React.SetStateAction<Set<ColumnFilterKey>>>;
};

const ColumnFilter = ({
    hiddenColumnSet,
    setHiddenColumnSet,
}: Props) => {
    const [hiddenSet, setHiddenSet] = useState<Set<ColumnFilterKey>>(hiddenColumnSet);

    const allColumnSet = new Set<ColumnFilterKey>([
        "assignee",
        "status",
        "plannedEffort",
        "buffer",
        "actualEffort",
        "notes",
    ]);

    const handleChangeFilterAll = () => {
        setHiddenSet((prev) => prev.size === 0 ? allColumnSet : new Set());
    };

    const handleChangeFilterColumn = (column: ColumnFilterKey) => {
        setHiddenSet((prev) =>  {
            const nextSet = new Set(prev);
            nextSet.has(column) ? nextSet.delete(column) : nextSet.add(column);
            return nextSet;
        });
    };

    const handleClickOk = () => {
        setHiddenColumnSet((prev) => new Set(hiddenSet));
    };

    const handleClickCancel = () => {
        setHiddenSet(hiddenColumnSet);
    };

    return (
        <>
            <button
                type="button"
                className={[
                    "relative flex items-center gap-1 cursor-pointer",
                    "filter-anchor"
                ].join(" ")}
                popoverTarget="filter-column"
            >
                <Eye className="size-4" />
                {hiddenColumnSet.size !== 0 && (
                    <span
                        className={[
                            "top-0 start-2.5 absolute w-2.5 h-2.5",
                            "bg-green-500 border-2 border-white rounded-full",
                            "dark:border-gray-800",
                        ].join(" ")}
                    />
                )}
                <span>表示</span>
            </button>
            <div
                id="filter-column"
                className={[
                    "absolute px-4 py-3 space-y-4 max-h-[50vh]",
                    "bg-white border border-slate-300 rounded-md shadow-sm",
                    "filter-popover",
                ].join(" ")}
                popover="auto"
            >
                <div className="border-b pb-2">
                    <Checkbox
                        id="filter-list-all-column"
                        label="すべて選択"
                        checked={hiddenSet.size === 0}
                        onChange={handleChangeFilterAll}
                    />
                </div>
                {Array.from(allColumnSet).map((column) => (
                    <Checkbox
                        key={column}
                        id={`filter-list-${column}`}
                        label={column}
                        checked={!hiddenSet.has(column)}
                        onChange={() => handleChangeFilterColumn(column)}
                    />
                ))}
                <div className="flex justify-end gap-4 border-t pt-2">
                    <button
                        className={[
                            "p-1 bg-blue-500 text-white text-xs rounded-md",
                            "hover:bg-blue-600",
                        ].join(" ")}
                        onClick={handleClickOk}
                        popoverTarget="filter-column"
                    >
                        OK
                    </button>
                    <button
                        type="button"
                        className={[
                            "p-1 bg-gray-500 text-white text-xs rounded-md",
                            "hover:bg-gray-600",
                        ].join(" ")}
                        onClick={handleClickCancel}
                        popoverTarget="filter-column"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </>
    );
};

export default ColumnFilter;