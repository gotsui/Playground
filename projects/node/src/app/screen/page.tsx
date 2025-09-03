"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Tab from "@/components/sidetabs/Tab";
import TabGroup from "@/components/sidetabs/TabGroup";
import TabList from "@/components/sidetabs/TabList";
import TabPanel from "@/components/sidetabs/TabPanel";

type Elm = {
    id: string;
    name: string;
    type: "actual" | "ghost";
};

type Point = {
    x: number;
    y: number;
};

const ScreenPage = () => {
    const [elements, setElements] = useState<Elm[][]>([]);
    const [rowIndex, setRowIndex] = useState<number | null>(null);
    const [columnIndex, setColumnIndex] = useState<number | null>(null);

    const displayElements: Elm[][] = useMemo(() => {
        console.log("rowIndex", rowIndex);
        console.log("columnIndex", columnIndex);
        if (rowIndex === null || columnIndex === null) {
            return elements;
        }

        const newElm: Elm = { id: performance.now().toString(), name: performance.now().toString(), type: "ghost" };

        if (rowIndex < 0) {
            return [[newElm]].concat(elements);
        } else if (rowIndex >= elements.length) {
            return elements.concat([[newElm]]);
        } else if (columnIndex < 0) {
            return elements.map((row, idx) => idx === rowIndex ? [newElm].concat(row) : row);
        } else {
            return elements.map((row, idx) => idx === rowIndex ? [...row.slice(0, columnIndex), newElm, ...row.slice(columnIndex)] : row);
        }
    }, [elements, rowIndex, columnIndex]);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData("application/screen", id);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) {
            return;
        }

        console.log("leave");
        setRowIndex(null);
        setColumnIndex(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();

        const target = e.target as HTMLElement;

        if (target.dataset.role === "parent") {
            setRowIndex(elements.length);
            setColumnIndex(0);
        } else if (target.dataset.role === "row") {
            const nextRowIndex = Number(target.dataset.row);
            const nextColumnIndex = nextRowIndex < elements.length ? elements[nextRowIndex].length : 0;
            setRowIndex(nextRowIndex);
            setColumnIndex(nextColumnIndex);
        } else if (target.dataset.role === "element") {
            const targetClientRect = target.getBoundingClientRect();
            const xl = targetClientRect.x;
            const yt = targetClientRect.y;
            const xr = xl + targetClientRect.width;
            const yb = yt + targetClientRect.height;

            const negativeGradientY = calcYByTwoPoints({ x: xl, y: yt })({ x: xr, y: yb })(e.clientX);
            const positiveGradientY = calcYByTwoPoints({ x: xl, y: yb })({ x: xr, y: yt })(e.clientX);

            const elementRowIndex = Number(target.dataset.row);
            const elementColumnIndex = Number(target.dataset.column);

            if (e.clientY >= negativeGradientY) {
                if (e.clientY >= positiveGradientY) {
                    // 上
                    setRowIndex(elementRowIndex + 1);
                    setColumnIndex(elementColumnIndex);
                } else {
                    // 右
                    setRowIndex(elementRowIndex);
                    setColumnIndex(elementColumnIndex - 1);
                }
            } else {
                if (e.clientY >= positiveGradientY) {
                    // 左
                    setRowIndex(elementRowIndex);
                    setColumnIndex(elementColumnIndex + 1);
                } else {
                    // 下
                    setRowIndex(elementRowIndex - 1);
                    setColumnIndex(elementColumnIndex);
                }
            }
        } else if (target.dataset.role === "ghost") {
            // 何もしない
        } else {
            setRowIndex(null);
            setColumnIndex(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        console.log("row", rowIndex);
        console.log("column", columnIndex);

        if (rowIndex === null || columnIndex === null) {
            return;
        }

        const id = e.dataTransfer.getData("application/screen");
        const newElm: Elm = { id, name: performance.now().toString(), type: "actual" };

        if (rowIndex < 0) {
            setElements([[newElm]].concat(elements));
        } else if (rowIndex >= elements.length) {
            setElements(elements.concat([[newElm]]));
        } else if (columnIndex < 0) {
            setElements(elements.map((row, idx) => idx === rowIndex ? [newElm].concat(row) : row));
        } else {
            setElements(elements.map((row, idx) => idx === rowIndex ? [...row.slice(0, columnIndex), newElm, ...row.slice(columnIndex)] : row));
        }

        setRowIndex(null);
        setColumnIndex(null);
    };

    const calcYByTwoPoints = (p1: Point) => {
        return (p2: Point) => {
            return (x: number) => {
                return (p2.y - p1.y) / (p2.x - p1.x) * (x - p1.x) + p1.y;
            };
        };
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
                                <div className="h-full w-32">
                                    <div
                                        className="
                                            cursor-grab border-b border-gray-200 p-1
                                            hover:bg-gray-200 transition
                                        "
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, performance.now().toString())}
                                    >
                                        input
                                    </div>
                                </div>
                            </TabPanel>
                        </TabGroup>
                    </div>
                </div>
                <div
                    className="flex-1 bg-gray-100"
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-role="parent"
                >
                    {displayElements.map((row, idx) => (
                        <div key={idx} className="flex" data-role="row" data-row={idx}>
                            {row.map((elm, idx2) => {
                                if (elm.type === "actual") {
                                    return (
                                        <div key={elm.id} className="h-10 w-40 bg-red-100" data-role="element" data-row={idx} data-column={idx2}>
                                            {elm.name}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={elm.id} className="h-10 w-40 bg-blue-100 border-2 border-dashed" data-role="ghost" data-row={idx} data-column={idx2}>
                                            {elm.name}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScreenPage;