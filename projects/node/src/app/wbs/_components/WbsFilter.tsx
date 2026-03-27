import { useState } from "react";
import { Filter } from "lucide-react";

import Checkbox from "./Checkbox";
import type { TaskNode, TaskWithCalc, WbsFilterKey, WbsFilterMap } from "../_lib/types";

type Props = {
    calcedRoot: TaskWithCalc;
    prop: WbsFilterKey;
    filterMap: WbsFilterMap;
    setFilterMap: React.Dispatch<React.SetStateAction<WbsFilterMap>>;
};

const WbsFilter = ({
    calcedRoot,
    prop,
    filterMap,
    setFilterMap,
}: Props) => {
    const [hiddenSet, setHiddenSet] = useState<Set<string>>(filterMap.get(prop) || new Set());

    const createPropertySet = (node: TaskNode) => {
        const setList = node.children.map((child) => createPropertySet(child));
        const propSet = new Set([node[prop]?.toString() || ""]);

        setList.forEach((set) => {
            set.forEach((value) => {
                propSet.add(value);
            });
        });

        return propSet;
    };

    const propAllSet = createPropertySet(calcedRoot);

    const handleChangeFilterAll = () => {
        setHiddenSet((prev) => prev.size === 0 ? propAllSet : new Set());
    };

    const handleChangeFilterItem = (id: string) => {
        setHiddenSet((prev) =>  {
            const nextSet = new Set(prev);
            nextSet.has(id) ? nextSet.delete(id) : nextSet.add(id);
            return nextSet;
        });
    };

    const handleClickOk = () => {
        setFilterMap((prev) => new Map(prev).set(prop, hiddenSet));
    };

    const handleClickCancel = () => {
        setHiddenSet(filterMap.get(prop) || new Set());
    };

    return (
        <>
            <button
                type="button"
                className={[
                    "relative size-4 cursor-pointer",
                    "filter-anchor",
                ].join(" ")}
                popoverTarget={`filter-${prop}`}
            >
                <Filter className="size-full" />
                {(filterMap.get(prop) || new Set()).size !== 0 && (
                    <span
                        className={[
                            "top-[-3] start-2.5 absolute w-2.5 h-2.5",
                            "bg-green-500 border-2 border-white rounded-full",
                            "dark:border-gray-800",
                        ].join(" ")}
                    />
                )}
            </button>
            <div
                id={`filter-${prop}`}
                className={[
                    "absolute px-4 py-3 space-y-4 max-h-[50vh]",
                    "bg-white border border-slate-300 rounded-md shadow-sm",
                    "filter-popover",
                ].join(" ")}
                popover="auto"
            >
                <div className="border-b pb-2">
                    <Checkbox
                        label="すべて選択"
                        checked={hiddenSet.size === 0}
                        onChange={handleChangeFilterAll}
                    />
                </div>
                {Array.from(propAllSet).sort().map((item) => (
                    <Checkbox
                        key={item}
                        label={String(item)}
                        checked={!hiddenSet.has(item)}
                        onChange={() => handleChangeFilterItem(item)}
                    />
                ))}
                <div className="flex justify-end gap-4 border-t pt-2">
                    <button
                        type="button"
                        className={[
                            "p-1 bg-blue-500 text-white text-xs rounded-md",
                            "hover:bg-blue-600",
                        ].join(" ")}
                        onClick={handleClickOk}
                        popoverTarget={`filter-${prop}`}
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
                        popoverTarget={`filter-${prop}`}
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </>
    );
};

export default WbsFilter;