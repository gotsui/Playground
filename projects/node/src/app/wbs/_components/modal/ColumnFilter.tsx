"use client";

import { useState } from "react";

import Checkbox from "../Checkbox";
import type { ColumnFilterKey } from "../../_lib/types";

type Props = {
    closeDialog: () => void;
    hiddenColumnSet: Set<ColumnFilterKey>;
    setHiddenColumnSet: React.Dispatch<React.SetStateAction<Set<ColumnFilterKey>>>;
};

const ColumnFilter = ({
    closeDialog,
    hiddenColumnSet,
    setHiddenColumnSet,
}: Props) => {
    const [hiddenSet, setHiddenSet] = useState<Set<ColumnFilterKey>>(hiddenColumnSet);

    const allColumnMap = new Map<ColumnFilterKey, string>([
        ["status", "ステータス"],
        ["plannedEffort", "予定工数"],
        ["buffer", "バッファ"],
        ["withBuffer", "バッファ込み"],
        ["actualEffort", "実績工数"],
        ["assignee", "主担当"],
        ["plannedStartDate", "開始予定日"],
        ["plannedEndDate", "終了予定日"],
        ["actualStartDate", "開始実績日"],
        ["actualEndDate", "終了実績日"],
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
        closeDialog();
    };

    const handleClickCancel = () => {
        setHiddenSet(hiddenColumnSet);
        closeDialog();
    };

    return (
        <div
            className={[
                "flex flex-col size-full px-4 py-3 space-y-4 overflow-hidden",
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
                    type="button"
                    className={[
                        "px-2 py-1 bg-blue-500 text-white rounded-md",
                        "hover:bg-blue-600",
                    ].join(" ")}
                    onClick={handleClickOk}
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
                >
                    キャンセル
                </button>
            </div>
        </div>
    );
};

export default ColumnFilter;