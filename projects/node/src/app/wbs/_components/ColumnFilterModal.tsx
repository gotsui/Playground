"use client";

import { useState } from "react";

import Checkbox from "./Checkbox";
import { ColumnFilterKey } from "../_lib/types";

type Props = {
    hiddenColumnSet: Set<ColumnFilterKey>;
    setHiddenColumnSet: React.Dispatch<React.SetStateAction<Set<ColumnFilterKey>>>;
    onClose: () => void;
};

const ColumnFilterModal = ({
    hiddenColumnSet,
    setHiddenColumnSet,
    onClose,
}: Props) => {
    const [hiddenSet, setHiddenSet] = useState<Set<ColumnFilterKey>>(hiddenColumnSet);

    const allColumnMap = new Map<ColumnFilterKey, string>([
        ["assignee", "主担当"],
        ["status", "ステータス"],
        ["plannedEffort", "予定工数"],
        ["buffer", "バッファ"],
        ["withBuffer", "バッファ込み"],
        ["actualEffort", "実績工数"],
        ["totalWithBuffer", "小計"],
        ["notes", "備考"],
    ]);

    const handleChangeFilterAll = () => {
        setHiddenSet((prev) => prev.size === 0 ? new Set(allColumnMap.keys()) : new Set());
    };

    const handleChangeFilterColumn = (column: ColumnFilterKey) => {
        setHiddenSet((prev) =>  {
            const nextSet = new Set(prev);
            nextSet.has(column) ? nextSet.delete(column) : nextSet.add(column);
            return nextSet;
        });
    };

    const handleClickOk = () => {
        setHiddenColumnSet(new Set(hiddenSet));
        onClose();
    };

    const handleClickCancel = () => {
        setHiddenSet(hiddenColumnSet);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full h-2/3 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div
                    id="filter-column"
                    className={[
                        "flex flex-col size-full px-4 py-3 space-y-4 overflow-hidden",
                        "bg-white border border-slate-300 rounded-md shadow-sm",
                    ].join(" ")}
                >
                    <div className="border-b pb-2">
                        <Checkbox
                            label="すべて選択"
                            checked={hiddenSet.size === 0}
                            onChange={handleChangeFilterAll}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 overflow-auto">
                        {Array.from(allColumnMap.keys()).map((column) => (
                            <Checkbox
                                key={column}
                                label={allColumnMap.get(column) || column}
                                checked={!hiddenSet.has(column)}
                                onChange={() => handleChangeFilterColumn(column)}
                            />
                        ))}
                    </div>
                    <div className="flex justify-end gap-4 border-t pt-2">
                        <button
                            className={[
                                "px-2 py-1 bg-blue-500 text-white rounded-md",
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
                                "px-2 py-1 bg-gray-500 text-white rounded-md",
                                "hover:bg-gray-600",
                            ].join(" ")}
                            onClick={handleClickCancel}
                            popoverTarget="filter-column"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColumnFilterModal;