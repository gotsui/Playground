"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Save, Type } from "lucide-react";

import { Field, Rect } from "../types";
import useDnD, { OnPointerUpAction, XYPosition } from "../lib/useDnD";
import { Handle, resizeRect } from "../lib/resize";
import { createLabel } from "../lib/field";
import { calcOffset, calcRelativePosition } from "../lib/position";
import { fieldSchema } from "../schemas/field";
import Grid from "./Grid";
import ResizeHandle from "./ResizeHandle";
import DragRect from "./DragRect";
import DragGhost from "./DragGhost";
import ResizeGhost from "./ResizeGhost";
import DataEditor from "./editrows/DataEditor";

type Props = {
    defaultFields: Field[];
};

const FormEditor = ({
    defaultFields,
}: Props) => {
    const { id } = useParams();
    const formId = Array.isArray(id) ? id[0] : id;

    const [fields, setFields] = useState<Field[]>(defaultFields);
    const [fieldType, setFieldType] = useState<Field["type"] | null>(null);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [startPosition, setStartPosition] = useState<XYPosition | null>(null);
    const [offset, setOffset] = useState<XYPosition | null>(null);
    const [handle, setHandle] = useState<Handle | null>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);
    const { handlePointerDown } = useDnD();

    const selectedField = fields.find((field) => field.id === selectedFieldId);
    const gridSize = useMemo(() => ({ row: 100, column: 50 }), []);
    const cellSize = useMemo(() => ({ width: 50, height: 50 }), []);

    const createField = (type: Field["type"], rect: Rect) => {
        switch (type) {
            case "label":
                const newField = createLabel(rect);
                setFields((prev) => prev.concat(newField));
                setSelectedFieldId(newField.id);
                break;
            default:
                break;
        };
    };

    const moveField = (id: string, position: XYPosition) => {
        setFields((prev) => prev.map(
            (field) => field.id === id
                ? {
                    ...field,
                    rect: {
                        ...field.rect,
                        top: position.y,
                        left: position.x,
                    },
                }
                : field
        ));
    };

    const handleCreatePointerUp = (
        type: Field["type"],
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

        createField(type, rect);
        setFieldType(null);
        setStartPosition(null);
    };

    const handleMovePointerUp = (
        id: string,
        offset: XYPosition,
    ): OnPointerUpAction => ({ position }) => {
        const endGrid = gridContainerRef.current;
        if (!endGrid) return;

        const calced = calcRelativePosition(position, endGrid);

        moveField(id, { x: calced.x + offset.x, y: calced.y + offset.y });
        setOffset(null);
    };

    const updateField = (next: Partial<Field> & Required<Pick<Field, "id">>) => {
        const prev = fields.find((field) => field.id === next.id);
        const parsed = fieldSchema.safeParse({ ...prev, ...next});

        if (parsed.success) {
            setFields((prev) => prev.map(
                (field) => field.id === parsed.data.id
                    ? parsed.data
                    : field
            ));
        } else {
            console.log(parsed.error);
        }
    };

    const handleResizePointerUp = (
        field: Field,
        handle: Handle,
    ): OnPointerUpAction => ({ position }) => {
        const endGrid = gridContainerRef.current;
        if (!endGrid) return;

        const rect = resizeRect(
            field.rect,
            handle,
            calcRelativePosition(position, endGrid),
        );

        updateField({ id: field.id, rect });
        setHandle(null);
    };

    const handleResizePointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        field: Field,
        handle: Handle,
    ) => {
        e.stopPropagation();
        setHandle(handle);
        handlePointerDown(e, handleResizePointerUp(field, handle));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setFieldType(null);
            }

            if (e.key === "Delete") {
                if (selectedFieldId) {
                    setFields((prev) => prev.filter((field) => field.id !== selectedFieldId));
                    setSelectedFieldId(null);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedFieldId, setSelectedFieldId, setFields, setFieldType]);

    return (
        <div className="w-screen h-screen">
            <div className="flex flex-col size-full">
                <div className="flex items-center h-8 p-4 bg-blue-200 space-x-4">
                    <div
                        className={[
                            "size-4 bg-gray-200 text-xs text-center cursor-pointer",
                            `${fieldType === "label" ? "border" : ""}`,
                        ].join(" ")}
                        onClick={() => setFieldType("label")}
                    >
                        <Type className="size-full" />
                    </div>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div
                        className="relative flex-1 overflow-auto"
                        onClick={() => setSelectedFieldId(null)}
                    >
                        <div
                            ref={gridContainerRef}
                            className={[
                                "absolute",
                                `${fieldType ? "cursor-crosshair" : ""}`,
                            ].join(" ")}
                            onPointerDown={
                                fieldType && gridContainerRef.current
                                    ? (e) => {
                                        const calced = calcRelativePosition(
                                            { x: e.clientX, y: e.clientY },
                                            gridContainerRef.current!,
                                        );
                                        setStartPosition(calced);
                                        handlePointerDown(e, handleCreatePointerUp("label", calced));
                                    }
                                    : undefined
                            }
                        >
                            <Grid gridSize={gridSize} cellSize={cellSize} />
                        </div>
                        {fields.map((field) => (
                            <div
                                key={field.id}
                                className={[
                                    "absolute flex",
                                    `${field.id === selectedFieldId ? "cursor-move" : "cursor-pointer"}`,
                                ].join(" ")}
                                style={{
                                    ...field.rect,
                                    ...field.data,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFieldId(field.id);
                                    setFieldType(null);
                                }}
                                onPointerDown={
                                    field.id === selectedFieldId
                                    ? (e) => {
                                        if (!gridContainerRef.current) return;

                                        const offset = calcOffset(
                                            calcRelativePosition(
                                                { x: e.clientX, y: e.clientY },
                                                gridContainerRef.current,
                                            ),
                                            field.rect,
                                        );

                                        setOffset(offset);
                                        handlePointerDown(e, handleMovePointerUp(field.id, offset));
                                    }
                                    : undefined
                                }
                            >
                                {field.data.value || field.type}
                                {field.id === selectedFieldId && (
                                    <ResizeHandle
                                        field={field}
                                        onPointerDown={handleResizePointerDown}
                                    />
                                )}
                            </div>
                        ))}
                        {startPosition && gridContainerRef.current && (
                            <DragRect
                                grid={gridContainerRef.current}
                                startPosition={startPosition}
                            />
                        )}
                        {selectedField && offset && gridContainerRef.current && (
                            <DragGhost
                                grid={gridContainerRef.current}
                                field={selectedField}
                                offset={offset}
                            />
                        )}
                        {selectedField && handle && gridContainerRef.current && (
                            <ResizeGhost
                                grid={gridContainerRef.current}
                                field={selectedField}
                                handle={handle}
                            />
                        )}
                    </div>
                    <div className="w-60">
                        {selectedField && (
                            <DataEditor
                                field={selectedField}
                                updateField={updateField}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormEditor;