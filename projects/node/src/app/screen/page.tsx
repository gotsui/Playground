"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";

import Tab from "@/components/sidetabs/Tab";
import TabGroup from "@/components/sidetabs/TabGroup";
import TabList from "@/components/sidetabs/TabList";
import TabPanel from "@/components/sidetabs/TabPanel";
import useDnD, { OnPointerUpAction } from "./useDnD";
import useGrid, { CellAddress, XYPosition } from "./useGrid";
import usePointerPosition from "./usePointerPosition";
import { range } from "./utils";

const menuItems: Item[] = [
    { id: "input", label: "input", size: { width: 2, height: 1 } },
    { id: "button", label: "button", size: { width: 1, height: 1 } },
    { id: "table", label: "table", size: { width: 3, height: 3 } },
];

type Item = {
    id: string;
    label: string;
    size: Size;
};

type Size = {
    width: number;
    height: number;
};

type Elm = {
    id: string;
    item: Item;
    address: CellAddress;
    size: Size;
};

const ScreenPage = () => {
    const ROW_NUM = 12;
    const COLUMN_NUM = 12;

    const itemId = useRef(0);
    const getId = () => {
        return `item_${itemId.current++}`;
    };

    const { gridRef, cellSize, screenToCellAddress } = useGrid({ row: ROW_NUM, column: COLUMN_NUM });

    // 配置要素一覧
    const [elms, setElms] = useState<Elm[]>([]);

    // 各セルの要素の有無
    const cells: boolean[][] = useMemo(() => {
        return elms.reduce((acc, elm) => {
            const rowRange = range(elm.address.row, elm.address.row + elm.size.height);
            const columnRange = range(elm.address.column, elm.address.column + elm.size.width);
            rowRange.forEach((i) => columnRange.forEach((j) => acc[i][j] = true));
            return acc;
        }, range(ROW_NUM).map((_) => range(COLUMN_NUM).map((_) => false)));
    }, [elms]);

    // 要素を表示するセル
    const elmCells = useMemo(() => {
        return range(ROW_NUM).map(
            (i) => range(COLUMN_NUM).map(
                (j) => elms.find((elm) => elm.address.row === i && elm.address.column === j)
            )
        );
    }, [elms]);

    const canDrop = (address: CellAddress, size: { width: number, height: number }): boolean => {
        const rowRange = range(address.row, address.row + size.height);
        const columnRange = range(address.column, address.column + size.width);
        return !rowRange.some((i) => columnRange.some((j) => cells[i][j]));
    };

    // 要素の作成、更新、削除
    const isValidElm = (address: CellAddress, size: Size): boolean => {
        // アドレスのグリッド内判定
        if (
            address.row < 0
            || address.row >= ROW_NUM
            || address.column < 0
            || address.column >= COLUMN_NUM
        ) {
            return false;
        }

        // サイズのグリッド内判定
        if (
            address.row + size.height > ROW_NUM
            || address.column + size.width > COLUMN_NUM
        ) {
            return false;
        }

        return true;
    };

    const createElm = (itemId: string, size: Size) => ({ position }: { position: XYPosition }) => {
        const newItem = menuItems.find((v) => v.id === itemId);
        if (!newItem) return;

        const address = screenToCellAddress(position);
        if (!isValidElm(address, size)) return;

        setElms((prev) => prev.concat({
            id: getId(),
            item: newItem,
            address,
            size,
        }));
    };

    const updateElmAddress = (elmId: string, elmSize: Size, offset: CellAddress) => ({ position }: { position: XYPosition }) => {
        const pointerAddress = screenToCellAddress(position);
        const nextAddress = {
            row: pointerAddress.row + offset.row,
            column: pointerAddress.column + offset.column,
        };

        if (!isValidElm(nextAddress, elmSize)) return;

        setElms((prev) => prev.map((elm) => elm.id === elmId ? { ...elm, address: nextAddress } : elm));
    };

    const updateElmSize = (elmId: string, startAddress: CellAddress) => ({ position }: { position: XYPosition }) => {
        const endAddress = screenToCellAddress(position);
        const nextSize = {
            width: Math.max(1, endAddress.column - startAddress.column + 1),
            height: Math.max(1, endAddress.row - startAddress.row + 1),
        };

        if (!isValidElm(startAddress, nextSize)) return;

        setElms((prev) => prev.map((elm) => elm.id === elmId ? { ...elm, size: nextSize } : elm));
    };

    const deleteElm = (elmId: string) => {
        setElms((prev) => prev.filter((elm) => elm.id !== elmId));
    };

    // DnD
    const { isDragging, handlePointerDown } = useDnD();
    const { pointerPosition } = usePointerPosition();

    const pointerCellAddress = pointerPosition
        ? screenToCellAddress(pointerPosition)
        : null;

    // 配置
    const [draggedElmSize, setDraggedElmSize] = useState<Size | null>(null);
    const [draggedOffset, setDraggedOffset] = useState<CellAddress | null>(null);

    const draggedElmAddress = pointerCellAddress && draggedOffset
        ? {
            row: pointerCellAddress.row + draggedOffset.row,
            column: pointerCellAddress.column + draggedOffset.column,
        }
        : null;

    const handleLayoutPointerUp = (action: OnPointerUpAction): OnPointerUpAction => {
        return ({ position }: { position: XYPosition }) => {
            action({ position });
            setDraggedElmSize(null);
            setDraggedOffset(null);
        };
    };

    // リサイズ
    const [resizedElmAddress, setResizedElmAddress] = useState<CellAddress | null>(null);

    const resizeSize = pointerCellAddress && resizedElmAddress
        ? {
            width: Math.max(1, pointerCellAddress.column - resizedElmAddress.column + 1 ),
            height: Math.max(1, pointerCellAddress.row - resizedElmAddress.row + 1),
        }
        : null;

    const handleResizePointerUp = (action: OnPointerUpAction): OnPointerUpAction => {
        return ({ position }: { position: XYPosition }) => {
            action({ position });
            setResizedElmAddress(null);
        };
    };

    return (
        <div className="h-screen w-screen flex flex-col select-none overflow-x-hidden">
            <div className="flex w-full h-full min-h-0 divide-x-2 divide-indigo-500">
                {pointerPosition && isDragging && draggedElmSize && (
                    <div
                        className="fixed pointer-events-none bg-yellow-100 opacity-50 z-100"
                        style={{
                            width: cellSize.width * draggedElmSize.width,
                            height: cellSize.height * draggedElmSize.height,
                            transform: `translate(${pointerPosition.x}px, ${pointerPosition.y}px) translate(-50%, -50%)`,
                        }}
                    />
                )}
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
                                            onPointerDown={(e) => {
                                                setDraggedElmSize(item.size);
                                                setDraggedOffset({ row: 0, column: 0 });
                                                handlePointerDown(e, handleLayoutPointerUp(createElm(item.id, item.size)));
                                            }}
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
                                {row.map((_, j) => (
                                    <div
                                        key={j}
                                        className={[
                                            "relative w-1/12 border-r border-b bg-slate-100",
                                        ].join(" ")}
                                    >
                                        {elmCells[i][j] && (
                                            <div
                                                className={[
                                                    "absolute bg-yellow-100 px-2 py-1 z-30 cursor-move",
                                                    "hover:not-[:has(.absolute:hover)]:bg-yellow-200",
                                                ].join(" ")}
                                                onPointerDown={(e) => {
                                                    const offset = {
                                                        row: (pointerCellAddress
                                                            ? elmCells[i][j]!.address.row - pointerCellAddress.row
                                                            : 0
                                                        ),
                                                        column: (pointerCellAddress
                                                            ? elmCells[i][j]!.address.column - pointerCellAddress.column
                                                            : 0
                                                        ),
                                                    };
                                                    setDraggedElmSize(elmCells[i][j]!.size);
                                                    setDraggedOffset(offset);
                                                    handlePointerDown(e, handleLayoutPointerUp(updateElmAddress(elmCells[i][j]!.id, elmCells[i][j]!.size, offset)));
                                                }}
                                                style={{
                                                    width: cellSize.width * elmCells[i][j].size.width,
                                                    height: cellSize.height * elmCells[i][j].size.height,
                                                }}
                                            >
                                                {elmCells[i][j].item.label}
                                                <div
                                                    className={[
                                                        "absolute top-0 right-0 z-50 w-3 h-3",
                                                        "bg-red-500 cursor-pointer",
                                                        "hover:bg-red-600",
                                                    ].join(" ")}
                                                    onClick={() => deleteElm(elmCells[i][j]!.id)}
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                />
                                                <div
                                                    className={[
                                                        "absolute bottom-0 right-0 z-50 w-3 h-3",
                                                        "bg-yellow-500 cursor-se-resize",
                                                        "hover:bg-yellow-600",
                                                    ].join(" ")}
                                                    onPointerDown={(e) => {
                                                        e.stopPropagation();
                                                        setResizedElmAddress(elmCells[i][j]!.address);
                                                        handlePointerDown(e, handleResizePointerUp(updateElmSize(elmCells[i][j]!.id, elmCells[i][j]!.address)));
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {draggedElmSize
                                        && draggedElmAddress
                                        && draggedElmAddress.row === i
                                        && draggedElmAddress.column === j
                                        && (
                                            <div
                                                className={[
                                                    "absolute z-50 pointer-events-none opacity-50",
                                                    // `${canDrop() ? "bg-green-300" : "bg-red-300"}`,
                                                    "bg-violet-300",
                                                ].join(" ")}
                                                style={{
                                                    width: cellSize.width * draggedElmSize.width,
                                                    height: cellSize.height * draggedElmSize.height,
                                                }}
                                            />
                                        )}
                                        {resizeSize
                                        && resizedElmAddress
                                        && resizedElmAddress.row === i
                                        && resizedElmAddress.column === j
                                        && (
                                            <div
                                                className={[
                                                    "absolute z-50 pointer-events-none opacity-50",
                                                    // `${canDrop() ? "bg-green-300" : "bg-red-300"}`,
                                                    "bg-violet-300",
                                                ].join(" ")}
                                                style={{
                                                    width: cellSize.width * resizeSize.width,
                                                    height: cellSize.height * resizeSize.height,
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