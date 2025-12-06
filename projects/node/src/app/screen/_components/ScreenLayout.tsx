"use client";

import React, { useRef, useState } from "react";

import DropIndicator from "./DropIndicator";
import Ghost from "./Ghost";
import Grid from "./Grid";
import GridElement from "./GridElement";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { useDnDContext, useGridContext } from "./hooks";
import { Elm, HandleDirection, Item, Size } from "./types";
import { OnPointerUpAction } from "./hooks/useDnD";
import { CellAddress, XYPosition } from "./hooks/useGrid";
import usePointerPosition from "./hooks/usePointerPosition";
import { resizeRect } from "./resize";

const menuItems: Item[] = [
    { id: "input", label: "input", size: { width: 2, height: 1 } },
    { id: "button", label: "button", size: { width: 1, height: 1 } },
    { id: "table", label: "table", size: { width: 3, height: 3 } },
];

const ScreenLayout = () => {
    const itemId = useRef(0);
    const getItemId = () => {
        return `item_${itemId.current++}`;
    };

    const [screenName, setScreenName] = useState("");
    const { rect, cellSize, screenToCellAddress, addressToPosition, getRow, getColumn } = useGridContext();

    // 配置要素一覧
    const [elms, setElms] = useState<Elm[]>([]);

    // 要素の作成、更新、削除
    const isValidElm = (address: CellAddress, size: Size): boolean => {
        // アドレスのグリッド内判定
        if (
            address.row < 0
            || address.row >= getRow()
            || address.column < 0
            || address.column >= getColumn()
        ) {
            return false;
        }

        // サイズのグリッド内判定
        if (
            address.row + size.height > getRow()
            || address.column + size.width > getColumn()
        ) {
            return false;
        }

        return true;
    };

    // グリッド内からはみ出さないように調整
    const placeWithinGrid = (address: CellAddress, size: Size): CellAddress => {
        return {
            row: Math.min(getRow() - size.height, Math.max(0, address.row)),
            column: Math.min(getColumn() - size.width, Math.max(0, address.column)),
        };
    };

    const createElm = (itemId: string, size: Size) => ({ position }: { position: XYPosition }) => {
        const newItem = menuItems.find((v) => v.id === itemId);
        if (!newItem) return;

        const address = screenToCellAddress(position);
        if (!isValidElm(address, size)) return;

        setElms((prev) => prev.concat({
            id: getItemId(),
            item: newItem,
            address,
            size,
            property: {
                label: newItem.label,
                type: "",
            },
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

    const updateElmSize = (elmId: string, startAddress: CellAddress, direction: HandleDirection) => ({ position }: { position: XYPosition }) => {
        const endAddress = screenToCellAddress(position);

        const nextSize = {
            width: Math.max(1, endAddress.column - startAddress.column + 1),
            height: Math.max(1, endAddress.row - startAddress.row + 1),
        };

        if (!isValidElm(startAddress, nextSize)) return;

        setElms((prev) => prev.map((elm) => elm.id === elmId ? { ...elm, size: nextSize } : elm));
    };

    const updateElmSize2 = (elm: Elm, direction: HandleDirection) => ({ position }: { position: XYPosition }) => {
        console.log(rect);
        const elmPos = addressToPosition(elm.address);
        const elmRect = { x: elmPos.x, y: elmPos.y, width: cellSize.width * elm.size.width, height: cellSize.height * elm.size.height };
        const nextRect = resizeRect(
            elmRect,
            direction,
            position,
            {
                maxSize: { width: rect.width, height: rect.height },
                minSize: { width: cellSize.width, height: cellSize.height },
            },
        );

        const startAddress = screenToCellAddress({ x: nextRect.x, y: nextRect.y });
        const endAddress = screenToCellAddress({ x: nextRect.x + nextRect.width, y: nextRect.y + nextRect.height });
        const size = { width: endAddress.column - startAddress.column + 1, height: endAddress.row - startAddress.row + 1 };
        setElms((prev) => prev.map((v) => v.id === elm.id ? { ...v, address: startAddress, size } : v));
    };

    const deleteElm = (elmId: string) => {
        setElms((prev) => prev.filter((elm) => elm.id !== elmId));
    };

    // DnD
    const { isDragging, handlePointerDown } = useDnDContext();
    const { pointerPosition } = usePointerPosition();

    const pointerCellAddress = pointerPosition
        ? screenToCellAddress(pointerPosition)
        : null;

    // 配置
    const [draggedElmSize, setDraggedElmSize] = useState<Size | null>(null);
    const [draggedOffset, setDraggedOffset] = useState<CellAddress | null>(null);

    const draggedElmAddress = pointerCellAddress && draggedOffset && draggedElmSize
        ? {
            row: pointerCellAddress.row + draggedOffset.row,
            column: pointerCellAddress.column + draggedOffset.column,
        }
        : null;

    const draggedElmPosition = draggedElmAddress && draggedElmSize && isValidElm(draggedElmAddress, draggedElmSize)
        ? addressToPosition(draggedElmAddress)
        : null;

    const handleLayoutPointerUp = (action: OnPointerUpAction): OnPointerUpAction => {
        return ({ position }: { position: XYPosition }) => {
            action({ position });
            setDraggedElmSize(null);
            setDraggedOffset(null);
        };
    };

    const handleGridElementPointerDown = (e: React.PointerEvent<HTMLDivElement>, elm: Elm) => {
        const offset = {
            row: (pointerCellAddress
                ? elm.address.row - pointerCellAddress.row
                : 0
            ),
            column: (pointerCellAddress
                ? elm.address.column - pointerCellAddress.column
                : 0
            ),
        };
        setDraggedElmSize(elm.size);
        setDraggedOffset(offset);
        handlePointerDown(e, handleLayoutPointerUp(updateElmAddress(elm.id, elm.size, offset)));
    };

    // リサイズ
    const [resizedElmAddress, setResizedElmAddress] = useState<CellAddress | null>(null);
    const [resizeHandle, setResizeHandle] = useState<HandleDirection | null>(null);

    const resizeRect2 = (elm: Elm, direction: HandleDirection, position: XYPosition) => {
        const elmPos = addressToPosition(elm.address);
        const elmRect = { x: elmPos.x, y: elmPos.y, width: cellSize.width * elm.size.width, height: cellSize.height * elm.size.height };
        const nextRect = resizeRect(
            elmRect,
            direction,
            position,
            {
                maxSize: { width: rect.width, height: rect.height },
                minSize: { width: cellSize.width, height: cellSize.height },
            },
        );

        const startAddress = screenToCellAddress({ x: nextRect.x, y: nextRect.y });
        const endAddress = screenToCellAddress({ x: nextRect.x + nextRect.width, y: nextRect.y + nextRect.height });
        const size = { width: endAddress.column - startAddress.column, height: endAddress.row - startAddress.row };
        setElms((prev) => prev.map((v) => v.id === elm.id ? { ...v, address: startAddress, size } : v));
    };

    const resizeSize = pointerCellAddress && resizedElmAddress
        ? {
            width: Math.max(1, pointerCellAddress.column - resizedElmAddress.column + 1 ),
            height: Math.max(1, pointerCellAddress.row - resizedElmAddress.row + 1),
        }
        : null;

    const resizedElmPosition = resizedElmAddress && resizeSize && isValidElm(resizedElmAddress, resizeSize)
        ? addressToPosition(resizedElmAddress)
        : null;

    const handleResizePointerUp = (action: OnPointerUpAction): OnPointerUpAction => {
        return ({ position }: { position: XYPosition }) => {
            action({ position });
            setResizedElmAddress(null);
        };
    };

    const handleHandlePointerDown = (e: React.PointerEvent<HTMLDivElement>, elm: Elm, direction: HandleDirection) => {
        e.stopPropagation();
        setResizedElmAddress(elm.address);
        // handlePointerDown(e, handleResizePointerUp(updateElmSize(elm.id, elm.address, direction)));
        handlePointerDown(e, handleResizePointerUp(updateElmSize2(elm, direction)));
    };

    // 編集
    const [selectedElmId, setSelectedElmId] = useState<string | null>(null);

    return (
        <div className="h-screen w-screen flex flex-col select-none overflow-x-hidden">
            <div className="flex w-full h-full min-h-0 divide-x-2 divide-indigo-500">
                {pointerPosition && isDragging && draggedElmSize && (
                    <Ghost
                        pointerPosition={pointerPosition}
                        cellSize={cellSize}
                        draggedElmSize={draggedElmSize}
                    />
                )}
                <LeftSidebar
                    setDraggedElmSize={setDraggedElmSize}
                    setDraggedOffset={setDraggedOffset}
                    handleLayoutPointerUp={handleLayoutPointerUp}
                    createElm={createElm}
                />
                <div className="flex-1 flex flex-col p-4">
                    <div className="flex items-end space-x-4 mb-2">
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">
                            <span>名前を付けて保存</span>
                            <input
                                type="text"
                                className={[
                                    "block w-full p-2.5",
                                    "bg-gray-50 text-gray-900 text-sm rounded-lg border border-gray-300",
                                    "focus:ring-blue-500 focus:border-blue-500",
                                    "dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
                                    "dark:focus:ring-blue-500 dark:focus:border-blue-500",
                                ].join(" ")}
                                value={screenName}
                                onChange={(e) => setScreenName(e.target.value)}
                                required
                            />
                        </label>
                        <button
                            type="button"
                            className={[
                                "px-4 py-2",
                                "bg-blue-500 text-white rounded-md",
                                "hover:bg-blue-600",
                            ].join(" ")}
                        >
                            保存
                        </button>
                    </div>
                    <Grid />
                    {elms.map((elm) => (
                        <GridElement
                            key={elm.id}
                            elm={elm}
                            setSelectedElmId={setSelectedElmId}
                            isSelected={elm.id === selectedElmId}
                            handleGridElementPointerDown={handleGridElementPointerDown}
                            handleHandlePointerDown={handleHandlePointerDown}
                        />
                    ))}
                    {draggedElmSize && draggedElmPosition && (
                        <DropIndicator
                            position={draggedElmPosition}
                            cellSize={cellSize}
                            indicatorSize={draggedElmSize}
                        />
                    )}
                    {resizedElmPosition && resizeSize && (
                        <DropIndicator
                            position={resizedElmPosition}
                            cellSize={cellSize}
                            indicatorSize={resizeSize}
                        />
                    )}
                </div>
                <RightSidebar
                    elms={elms}
                    setElms={setElms}
                    selectedElmId={selectedElmId}
                    setSelectedElmId={setSelectedElmId}
                    deleteElm={deleteElm}
                />
            </div>
        </div>
    );
};

export default ScreenLayout;