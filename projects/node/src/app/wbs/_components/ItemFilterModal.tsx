"use client";

import { useState } from "react";

import Checkbox from "./Checkbox";
import { TaskNode, WbsFilterKey, WbsFilterMap } from "../_lib/types";
import { Filter } from "lucide-react";

type Props = {
    node: TaskNode;
    filterMap: WbsFilterMap;
    setFilterMap: React.Dispatch<React.SetStateAction<WbsFilterMap>>;
    onClose: () => void;
};

const ItemFilterModal = ({
    node,
    filterMap,
    setFilterMap,
    onClose,
}: Props) => {
    const [selectedProp, setSelectedProp] = useState<WbsFilterKey | null>(null);
    const [hiddenSet, setHiddenSet] = useState<Set<string>>(new Set());

    const createPropertySet = (node: TaskNode): Set<string> => {
        if (!selectedProp) {
            return new Set();
        }

        const setList = node.children.map((child) => createPropertySet(child));
        const propSet = new Set([node[selectedProp]?.toString() || ""]);

        setList.forEach((set) => {
            set.forEach((value) => {
                propSet.add(value);
            });
        });

        return propSet;
    };

    const propAllSet = createPropertySet(node);

    const handleChangeFilterAll = () => {
        setHiddenSet((prev) => prev.size === 0 ? propAllSet : new Set());
    };

    const handleChangeFilterItem = (item: string) => {
        setHiddenSet((prev) =>  {
            const nextSet = new Set(prev);
            nextSet.has(item) ? nextSet.delete(item) : nextSet.add(item);
            return nextSet;
        });
    };

    const handleClickOk = () => {
        if (!selectedProp) return;

        setFilterMap((prev) => new Map(prev).set(selectedProp, hiddenSet));
        setSelectedProp(null);
    };

    const handleClickCancel = () => {
        if (!selectedProp) return;

        setHiddenSet(filterMap.get(selectedProp) || new Set());
        setSelectedProp(null);
    };

    const handleClickItem = (prop: WbsFilterKey) => {
        setSelectedProp(prop);
        setHiddenSet(filterMap.get(prop) || new Set());
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-end z-50" onClick={onClose}>
            <div className="flex flex-col bg-white rounded-lg p-8 max-w-2xl w-full h-2/3 mr-8 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex flex-col gap-2 w-1/3">
                        <p className="text-lg mb-4">フィルター設定</p>
                        <button
                            type="button"
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleClickItem("name")}
                        >
                            <span>タスク名</span>
                            <div className="relative">
                                <Filter size={16} />
                                {(filterMap.get("name") || new Set()).size !== 0 && (
                                    <span
                                        className={[
                                            "top-[-3.5] start-2.5 absolute w-2.5 h-2.5",
                                            "bg-green-500 border-2 border-white rounded-full",
                                            "dark:border-gray-800",
                                        ].join(" ")}
                                    />
                                )}
                            </div>
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleClickItem("assignee")}
                        >
                            <span>主担当</span>
                            <div className="relative">
                                <Filter size={16} />
                                {(filterMap.get("assignee") || new Set()).size !== 0 && (
                                    <span
                                        className={[
                                            "top-[-3.5] start-2.5 absolute w-2.5 h-2.5",
                                            "bg-green-500 border-2 border-white rounded-full",
                                            "dark:border-gray-800",
                                        ].join(" ")}
                                    />
                                )}
                            </div>
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => handleClickItem("status")}
                        >
                            <span>ステータス</span>
                            <div className="relative">
                                <Filter size={16} />
                                {(filterMap.get("status") || new Set()).size !== 0 && (
                                    <span
                                        className={[
                                            "top-[-3.5] start-2.5 absolute w-2.5 h-2.5",
                                            "bg-green-500 border-2 border-white rounded-full",
                                            "dark:border-gray-800",
                                        ].join(" ")}
                                    />
                                )}
                            </div>
                        </button>
                    </div>
                    <div
                        className={[
                            "flex-1 flex flex-col px-4 py-3 space-y-4",
                            "bg-white border border-slate-300 rounded-md shadow-sm",
                        ].join(" ")}
                    >
                        {selectedProp ? (
                            <>
                                <div className="border-b pb-2">
                                    <Checkbox
                                        label="すべて選択"
                                        checked={hiddenSet.size === 0}
                                        onChange={handleChangeFilterAll}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-2 overflow-auto">
                                    {Array.from(propAllSet).map((item) => (
                                        <Checkbox
                                            key={item}
                                            label={item}
                                            checked={!hiddenSet.has(item)}
                                            onChange={() => handleChangeFilterItem(item)}
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
                            </>
                        ) : (
                            <div
                                className={[
                                    "flex items-center justify-center size-full",
                                    "text-gray-500 select-none",
                                ].join(" ")}
                            >
                                項目を選択してください
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-6 text-right">
                    <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" onClick={onClose}>
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemFilterModal;