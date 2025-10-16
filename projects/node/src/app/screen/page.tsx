"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import Tab from "@/components/sidetabs/Tab";
import TabGroup from "@/components/sidetabs/TabGroup";
import TabList from "@/components/sidetabs/TabList";
import TabPanel from "@/components/sidetabs/TabPanel";
import useDOMSize from "./useDOMSize";
import useGrid from "./useGrid";

type Range = {
    (num: number): number[];
    (begin: number, end: number): number[];
};

const range: Range = (begin: number, end?: number) => {
    if (end === undefined) {
        return [...Array(begin)].map((_, i) => i);
    } else {
        return [...Array(end - begin)].map((_, i) => (begin + i));
    }
};

const menuItems: Item[] = [
    { id: "input", label: "input", width: 2, height: 1 },
    { id: "button", label: "button", width: 1, height: 1 },
    { id: "table", label: "table", width: 3, height: 3 },
];

type Item = {
    id: string;
    label: string;
    width: number;
    height: number;
};

type Address = {
    row: number;
    column: number;
};

type Elm = {
    id: string;
    item: Item;
    address: Address;
};

const ScreenPage = () => {
    const ROW_NUM = 12;
    const COLUMN_NUM = 12;

    const { gridRef, rect, cellSize } = useGrid({ row: ROW_NUM, column: COLUMN_NUM });

    // 配置要素一覧
    const [elms, setElms] = useState<Elm[]>([]);

    // 新規追加・再配置用
    const [draggedElm, setDraggedElm] = useState<Elm | null>(null);
    const [dragOverAddress, setDragOverAddress] = useState<Address | null>(null);

    // 各セルの要素の有無
    const cells: boolean[][] = useMemo(() => {
        const displayElms = draggedElm
            ? elms.filter((elm) => elm.id !== draggedElm.id)
            : elms;

        return displayElms.reduce((acc, elm) => {
            const rowRange = range(elm.address.row, elm.address.row + elm.item.height);
            const columnRange = range(elm.address.column, elm.address.column + elm.item.width);
            rowRange.forEach((i) => columnRange.forEach((j) => acc[i][j] = true));
            return acc;
        }, range(ROW_NUM).map((_) => range(COLUMN_NUM).map((_) => false)));
    }, [elms, draggedElm]);

    // 要素を表示するセル
    const elmCells = useMemo(() => {
        return range(ROW_NUM).map(
            (i) => range(COLUMN_NUM).map(
                (j) => elms.find((elm) => elm.address.row === i && elm.address.column === j)
            )
        );
    }, [elms]);

    const handleMenuDragStart = (e: React.DragEvent, id: string) => {
        const item = menuItems.find((item) => item.id === id);
        if (!item) return;

        setDraggedElm({ id: crypto.randomUUID(), item, address: { row: -1, column: -1 }})
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedElm(null);
        setDragOverAddress(null);
    };

    const handleCellDragOver = (e: React.DragEvent, addr: Address) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverAddress(addr);
    };

    const handleCellDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if (canDrop() && draggedElm && dragOverAddress) {
            const newElm: Elm = { ...draggedElm, address: dragOverAddress };

            setElms((prev) => prev.some((elm) => elm.id === draggedElm.id)
                ? prev.map((elm) => elm.id === draggedElm.id ? newElm : elm)
                : prev.concat(newElm)
            );
        }

        setDraggedElm(null);
        setDragOverAddress(null);
    };

    const canDrop = () => {
        if (!draggedElm || !dragOverAddress) return false;

        const rowRange = range(dragOverAddress.row, dragOverAddress.row + draggedElm.item.height);
        const columnRange = range(dragOverAddress.column, dragOverAddress.column + draggedElm.item.width);

        return !rowRange.some((i) => columnRange.some((j) => cells[i][j]));
    };

    const handleElmDragStart = (e: React.DragEvent, elm: Elm) => {
        e.dataTransfer.effectAllowed = "move";
        setDraggedElm(elm);
    };

    return (
        <div className="h-screen w-screen flex flex-col select-none overflow-x-hidden">
            <div className="flex w-full h-full min-h-0 divide-x-2 divide-indigo-500">
                <div className="flex flex-col">
                    <div className="p-2">
                        <Link href="/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">← 戻る</Link>
                    </div>
                    <div className="flex-1 flex">
                        <TabGroup defaultTab="form">
                            <TabList>
                                <Tab id="form">フォーム</Tab>
                            </TabList>
                            <TabPanel id="form">
                                <div className="h-full w-32 space-y-2">
                                    {menuItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="
                                                cursor-grab border-b border-gray-200 p-1
                                                hover:bg-gray-200 transition
                                                active:cursor-grabbing
                                            "
                                            onDragStart={(e) => handleMenuDragStart(e, item.id)}
                                            onDragEnd={handleDragEnd}
                                            draggable={true}
                                        >
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </TabPanel>
                        </TabGroup>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    <div ref={gridRef} className="h-full border-t border-l">
                        {cells.map((row, i) => (
                            <div key={i} className="flex h-1/12">
                                {row.map((hasElm, j) => (
                                    <div
                                        key={j}
                                        className={[
                                            "relative w-1/12 border-r border-b bg-slate-100",
                                        ].join(" ")}
                                        onDragOver={(e) => handleCellDragOver(e, { row: i, column: j })}
                                        onDrop={!hasElm ? handleCellDrop : undefined}
                                    >
                                        {elmCells[i][j] && (
                                            <div
                                                className={[
                                                    "absolute bg-yellow-100 px-2 py-1 z-30 cursor-move",
                                                    "hover:bg-yellow-200",
                                                    `${draggedElm && (
                                                        draggedElm.id === elmCells[i][j].id
                                                            ? "active:invisible transition duration-initial"
                                                            : "pointer-events-none"
                                                    )}`,
                                                ].join(" ")}
                                                onDragStart={(e) => handleElmDragStart(e, elmCells[i][j]!)}
                                                onDragEnd={handleDragEnd}
                                                onDragOver={(e) => {e.stopPropagation()}}
                                                draggable={true}
                                                style={{
                                                    width: cellSize.width * elmCells[i][j].item.width,
                                                    height: cellSize.height * elmCells[i][j].item.height,
                                                }}
                                            >
                                                {elmCells[i][j].item.label}
                                            </div>
                                        )}
                                        {draggedElm
                                        && dragOverAddress
                                        && dragOverAddress.row === i
                                        && dragOverAddress.column === j
                                        && (
                                            <div
                                                className={[
                                                    "absolute z-50 pointer-events-none opacity-50",
                                                    `${canDrop() ? "bg-green-300" : "bg-red-300"}`,
                                                ].join(" ")}
                                                style={{
                                                    width: cellSize.width * draggedElm.item.width,
                                                    height: cellSize.height * draggedElm.item.height,
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScreenPage;