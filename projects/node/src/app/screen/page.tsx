"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import Tab from "@/components/sidetabs/Tab";
import TabGroup from "@/components/sidetabs/TabGroup";
import TabList from "@/components/sidetabs/TabList";
import TabPanel from "@/components/sidetabs/TabPanel";

const range = (begin: number, end: number) => ([...Array(end - begin)].map((_, i) => (begin + i)));

const menuItems: Item[] = [
    { id: "input", label: "input", width: 2, height: 1 },
    { id: "button", label: "button", width: 1, height: 1 },
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
    dragOverAddress: Address;
};

const ScreenPage = () => {
    const [elms, setElms] = useState<Elm[]>([]);
    const [draggedElm, setDraggedElm] = useState<Elm | null>(null);
    const [dragOverAddress, setDragOverAddress] = useState<Address | null>(null);

    // セルサイズ取得用
    const cellRef = useRef<HTMLDivElement>(null);
    const [cellSize, setCellSize] = useState({ width: 0, height: 0 });

    const cells: boolean[][] = useMemo(() => {
        return elms.reduce((acc, elm) => {
            const rowRange = range(elm.dragOverAddress.row, elm.dragOverAddress.row + elm.item.height);
            const columnRange = range(elm.dragOverAddress.column, elm.dragOverAddress.column + elm.item.width);
            rowRange.forEach((i) => columnRange.forEach((j) => acc[i][j] = true));
            return acc;
        }, range(0, 12).map((_) => range(0, 12).map((_) => false)));
    }, [elms]);

    const elmCells = useMemo(() => {
        return range(0, 12).map(
            (i) => range(0, 12).map(
                (j) => elms.find((elm) => elm.dragOverAddress.row === i && elm.dragOverAddress.column === j)
            )
        );
    }, [elms]);

    // 初期レンダリング・リサイズ時のセルサイズ取得
    useEffect(() => {
        const cell = cellRef.current;
        if (!cell) return;

        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const rect = entries[0].contentRect;
                setCellSize({ width: rect.width, height: rect.height });
            }
        });

        observer.observe(cell);

        // クリーンアップ関数
        return () => observer.disconnect();
    }, []);

    const handleMenuDragStart = (e: React.DragEvent, id: string) => {
        const item = menuItems.find((item) => item.id === id);
        if (!item) return;

        setDraggedElm({ id: crypto.randomUUID(), item, dragOverAddress: { row: -1, column: -1}})
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
        if (!canDrop()) return;

        if (draggedElm && dragOverAddress) {
            setElms((prev) => prev.some((elm) => elm.id === draggedElm.id)
                ? prev.map((elm) => elm.id === draggedElm.id ? { ...draggedElm, dragOverAddress } : elm)
                : prev.concat({ ...draggedElm, dragOverAddress })
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
        setDraggedElm(elm);
        e.dataTransfer.effectAllowed = "move";
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
                    <div className="h-full border-t border-l">
                        {cells.map((row, i) => (
                            <div key={i} className="flex h-1/12">
                                {row.map((hasElm, j) => (
                                    <div
                                        key={j}
                                        ref={i === 0 && j === 0 ? cellRef : undefined}
                                        className={[
                                            "relative w-1/12 border-r border-b bg-slate-100",
                                            "hover:bg-slate-200",
                                        ].join(" ")}
                                        onDragOver={(e) => handleCellDragOver(e, { row: i, column: j })}
                                        onDrop={!hasElm ? handleCellDrop : undefined}
                                    >
                                        {elmCells[i][j] && (
                                            <div
                                                className={[
                                                    "absolute bg-yellow-100 px-2 py-1 z-30 cursor-grab",
                                                    "hover:bg-yellow-200 active:cursor-grabbing",
                                                    `${draggedElm && draggedElm.id !== elmCells[i][j].id && "pointer-events-none"}`,
                                                ].join(" ")}
                                                onDragStart={(e) => handleElmDragStart(e, elmCells[i][j]!)}
                                                onDragEnd={handleDragEnd}
                                                draggable={true}
                                                style={{
                                                    width: cellSize.width * elmCells[i][j].item.width,
                                                    height: cellSize.height * elmCells[i][j].item.height,
                                                }}
                                            >
                                                {elmCells[i][j].item.label}
                                            </div>
                                        )}
                                        {draggedElm && dragOverAddress && (
                                            <div
                                                className={[
                                                    "absolute z-50 pointer-events-none opacity-50",
                                                    `${dragOverAddress.row === i && dragOverAddress.column === j && (canDrop() ? "bg-green-300" : "bg-red-300")}`,
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