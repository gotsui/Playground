"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Square, SquareChartGantt, TextCursorInput } from "lucide-react";

import type { FormElement as FormElementType, Rect } from "../types";
import useDnD, { type OnPointerUpAction, type XYPosition } from "../lib/useDnD";
import { type Handle, resizeRect } from "../lib/resize";
import { createInput, createLabel } from "../lib/formElement";
import { calcOffset, calcRelativePosition } from "../lib/position";
import { formElementSchema } from "../schemas/formElement";
import Grid from "./Grid";
import DragRect from "./DragRect";
import DragGhost from "./DragGhost";
import ResizeGhost from "./ResizeGhost";
import DataEditor from "./editrows/DataEditor";
import SaveDialogButton from "./SaveDialogButton";
import UpdateButton from "./UpdateButton";
import FormElement from "./FormElement";
import "../styles.css";

type Props = {
    defaultElements: FormElementType[];
};

const FormEditor = ({
    defaultElements,
}: Props) => {
    const { id } = useParams();
    const formId = Array.isArray(id) ? id[0] : id;

    const [elements, setElements] = useState<FormElementType[]>(defaultElements);
    const [elementType, setElementType] = useState<FormElementType["type"] | null>(null);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [startPosition, setStartPosition] = useState<XYPosition | null>(null);
    const [offset, setOffset] = useState<XYPosition | null>(null);
    const [handle, setHandle] = useState<Handle | null>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const { handlePointerDown } = useDnD();

    const selectedElement = elements.find((element) => element.id === selectedElementId);
    const gridSize = useMemo(() => ({ row: 100, column: 50 }), []);
    const cellSize = useMemo(() => ({ width: 50, height: 50 }), []);

    const createElement = (type: FormElementType["type"], rect: Rect) => {
        switch (type) {
            case "label": {
                const newElement = createLabel(rect);
                setElements((prev) => prev.concat(newElement));
                setSelectedElementId(newElement.id);
                break;
            }
            case "input": {
                const newElement = createInput(rect);
                setElements((prev) => prev.concat(newElement));
                setSelectedElementId(newElement.id);
                break;
            }
            default:
                break;
        };
    };

    const moveElement = (id: string, position: XYPosition) => {
        setElements((prev) => prev.map(
            (element) => element.id === id
                ? {
                    ...element,
                    rect: {
                        ...element.rect,
                        top: position.y,
                        left: position.x,
                    },
                }
                : element
        ));
    };

    const handleCreatePointerUp = (
        type: FormElementType["type"],
        startPosition: XYPosition,
    ): OnPointerUpAction => ({ position }) => {
        const endGrid = gridContainerRef.current;
        if (!endGrid) return;

        const { x: startX, y: startY } = startPosition;
        const { x: endX, y: endY } = calcRelativePosition(position, endGrid);

        const rect: Rect = {
            top: startY < endY ? startY : endY,
            left: startX < endX ? startX : endX,
            width: Math.abs(startX - endX),
            height: Math.abs(startY - endY),
        };

        createElement(type, rect);
        setElementType(null);
        setStartPosition(null);
    };

    const handleMovePointerUp = (
        id: string,
        offset: XYPosition,
    ): OnPointerUpAction => ({ position }) => {
        const endGrid = gridContainerRef.current;
        if (!endGrid) return;

        const calced = calcRelativePosition(position, endGrid);

        moveElement(id, { x: calced.x + offset.x, y: calced.y + offset.y });
        setOffset(null);
    };

    const updateElement = (next: Partial<FormElementType> & Required<Pick<FormElementType, "id">>) => {
        const prev = elements.find((element) => element.id === next.id);
        const parsed = formElementSchema.safeParse({ ...prev, ...next});

        if (parsed.success) {
            setElements((prev) => prev.map(
                (element) => element.id === parsed.data.id
                    ? parsed.data
                    : element
            ));
        } else {
            console.log(parsed.error);
        }
    };

    const handleResizePointerUp = (
        element: FormElementType,
        handle: Handle,
    ): OnPointerUpAction => ({ position }) => {
        const endGrid = gridContainerRef.current;
        if (!endGrid) return;

        const rect = resizeRect(
            element.rect,
            handle,
            calcRelativePosition(position, endGrid),
        );

        updateElement({ id: element.id, rect });
        setHandle(null);
    };

    const handleResizePointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        element: FormElementType,
        handle: Handle,
    ) => {
        e.stopPropagation();
        setHandle(handle);
        handlePointerDown(e, handleResizePointerUp(element, handle));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setElementType(null);
            }

            if (e.key === "Delete") {
                if (selectedElementId) {
                    setElements((prev) => prev.filter((element) => element.id !== selectedElementId));
                    setSelectedElementId(null);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedElementId]);

    return (
        <div className="w-screen h-screen">
            <div className="flex flex-col size-full">
                <div className="flex items-center h-8 p-4 bg-blue-200 space-x-4">
                    <div className="size-4">
                        <Link href="/form">
                            <ArrowLeft className="size-full" />
                        </Link>
                    </div>
                    {formId ? (
                        <div className="size-4">
                            <UpdateButton id={formId} elements={elements} />
                        </div>
                    ) : (
                        <div className="size-4">
                            <SaveDialogButton caption="名前を付けて保存" elements={elements} />
                        </div>
                    )}
                    <button
                        type="button"
                        className={[
                            "size-4 bg-gray-200 text-xs text-center cursor-pointer",
                            `${elementType === "label" ? "border" : ""}`,
                            "anchor-scope group",
                        ].join(" ")}
                        onClick={() => setElementType("label")}
                    >
                        <Square className="size-full relative anchor" />
                        <span
                            className={[
                                "popover hidden p-0.5 bg-white",
                                "after:",
                                "group-hover:block",
                            ].join(" ")}
                        >
                            text
                        </span>
                    </button>
                    <button
                        type="button"
                        className={[
                            "size-4 bg-gray-200 text-xs text-center cursor-pointer",
                            `${elementType === "input" ? "border" : ""}`,
                            "anchor-scope group",
                        ].join(" ")}
                        onClick={() => setElementType("input")}
                    >
                        <TextCursorInput className="size-full relative anchor" />
                        <span
                            className={[
                                "popover hidden p-0.5 bg-white",
                                "after:",
                                "group-hover:block",
                            ].join(" ")}
                        >
                            input
                        </span>
                    </button>
                    <button
                        type="button"
                        className={[
                            "size-4 bg-gray-200 text-xs text-center cursor-pointer",
                            `${elementType === "input" ? "border" : ""}`,
                            "anchor-scope group",
                        ].join(" ")}
                        onClick={() => setElementType("input")}
                    >
                        <SquareChartGantt className="size-full relative anchor" />
                        <span
                            className={[
                                "popover hidden p-0.5 bg-white",
                                "after:",
                                "group-hover:block",
                            ].join(" ")}
                        >
                            textarea
                        </span>
                    </button>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: マウス専用の要素選択解除 */}
                    <div
                        className="relative flex-1 overflow-auto"
                        onClick={() => setSelectedElementId(null)}
                    >
                        <div
                            ref={gridContainerRef}
                            className={[
                                "absolute",
                                `${elementType ? "cursor-crosshair" : ""}`,
                            ].join(" ")}
                            onPointerDown={
                                elementType && gridContainerRef.current
                                    ? (e) => {
                                        if (!gridContainerRef.current) {
                                            return;
                                        }

                                        const calced = calcRelativePosition(
                                            { x: e.clientX, y: e.clientY },
                                            gridContainerRef.current,
                                        );
                                        setStartPosition(calced);
                                        handlePointerDown(e, handleCreatePointerUp(elementType, calced));
                                    }
                                    : undefined
                            }
                        >
                            <Grid gridSize={gridSize} cellSize={cellSize} />
                        </div>
                        {elements.map((element) => (
                            <FormElement
                                key={element.id}
                                element={element}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedElementId(element.id);
                                    setElementType(null);
                                }}
                                onPointerDownElement={(e) => {
                                    if (!gridContainerRef.current) return;

                                    const offset = calcOffset(
                                        calcRelativePosition(
                                            { x: e.clientX, y: e.clientY },
                                            gridContainerRef.current,
                                        ),
                                        element.rect,
                                    );

                                    setOffset(offset);
                                    handlePointerDown(e, handleMovePointerUp(element.id, offset));
                                }}
                                onPointerDownHandle={handleResizePointerDown}
                                isSelected={element.id === selectedElementId}
                            />
                        ))}
                        {startPosition && gridContainerRef.current && (
                            <DragRect
                                grid={gridContainerRef.current}
                                startPosition={startPosition}
                            />
                        )}
                        {selectedElement && offset && gridContainerRef.current && (
                            <DragGhost
                                grid={gridContainerRef.current}
                                element={selectedElement}
                                offset={offset}
                            />
                        )}
                        {selectedElement && handle && gridContainerRef.current && (
                            <ResizeGhost
                                grid={gridContainerRef.current}
                                element={selectedElement}
                                handle={handle}
                            />
                        )}
                    </div>
                    <div className="w-60">
                        {selectedElement && (
                            <DataEditor
                                element={selectedElement}
                                updateElement={updateElement}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEditor;