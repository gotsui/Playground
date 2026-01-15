"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

import Grid from "@/features/form/components/Grid";
import { formsSchema } from "@/features/form/schemas/form";
import { Form } from "@/features/form/types";
import useDnD, { OnPointerUpAction } from "@/hooks/useDnD";
import Ghost from "./Ghost";
import ProcessIcon from "./processes/ProcessIcon";
import {
    addressToPosition,
    calcCellOffset,
    calcElementOffset,
    coordinatesToAddress,
} from "../lib/grid";
import { CellAddress, Position, Process } from "../types";
import Link from "next/link";
import SaveDialogButton from "./SaveDialogButton";

const initialProcesses: Process[] = [
    { id: crypto.randomUUID(), name: "開始", step: 1, priority: 1, type: "start", data: {} },
];

type Props = {
    defaultProcesses: Process[];
};

const WorkflowEditor = ({
    defaultProcesses,
}: Props) => {
    const gridSize = { row: 15, column: 25 };
    const cellSize = { width: 80, height: 80 };
    const [processes, setProcesses] = useState<Process[]>(initialProcesses);
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
    const [forms, setForms] = useState<Form[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<string>("");
    const [draggedType, setDraggedType] = useState<Process["type"] | null>(null);
    const [draggedOffset, setDraggedOffset] = useState<Position | null>(null);
    const { handlePointerDown } = useDnD();
    const areaRef = useRef<HTMLDivElement>(null);
    const gridContainerRef = useRef<HTMLDivElement>(null);

    const selectedProcess = processes.find((process) => process.id === selectedProcessId);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Delete") {
                if (selectedProcessId) {
                    setProcesses((prev) => prev.filter((process) => process.id !== selectedProcessId));
                    setSelectedProcessId(null);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedProcessId, setSelectedProcessId, setProcesses]);

    useEffect(() => {
        const fetchForm = async () => {
            const res = await fetch("/api/form");

            if (!res.ok) {
                console.error(await res.json());
                return;
            };

            const { forms } = await res.json();
            const parsed = formsSchema.safeParse(forms);

            if (parsed.success) {
                setForms(parsed.data);
            }
        };

        fetchForm();
    }, []);

    const isDuplicatedAddress = (address: CellAddress) => {
        return processes.some(
            (process) =>
                (process.step === address.column + 1)
                && (process.priority === address.row + 1)
        );
    };

    const isWithinArea = (position: Position) => {
        if (!areaRef.current) return false;

        const areaRect = areaRef.current.getBoundingClientRect();

        if (
            position.top >= areaRect.top
            && position.left >= areaRect.left
            && position.top <= (areaRect.top + areaRect.height)
            && position.left <= (areaRect.left + areaRect.width)
        ) {
            return true;
        } else {
            return false;
        }
    };

    const isWithinGrid = (address: CellAddress) => {
        if (
            address.row >= 0
            && address.column >= 0
            && address.row < gridSize.row
            && address.column < gridSize.column
        ) {
            return true;
        } else {
            return false;
        }
    };

    const handleMenuPointerUp = (
        type: Process["type"],
    ): OnPointerUpAction => ({ position }) => {
        if (!gridContainerRef.current) return;

        const address = coordinatesToAddress(
            position,
            gridContainerRef.current.getBoundingClientRect(),
            cellSize,
        );

        if (
            !isDuplicatedAddress(address)
            && isWithinArea({ top: position.y, left: position.x })
            && isWithinGrid(address)
        ) {
            const id = crypto.randomUUID();

            setProcesses((prev) => prev.concat({
                id,
                name: type,
                step: address.column + 1,
                priority: address.row + 1,
                type,
                data: {},
            }));
            setSelectedProcessId(id);
        }

        setDraggedType(null);
        setDraggedOffset(null);
    };

    const handleMenuProcessPointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        type: Process["type"],
    ) => {
        setDraggedType(type);
        setDraggedOffset(calcElementOffset(e));
        handlePointerDown(e, handleMenuPointerUp(type));
    };

    const handleGridProcessPointerUp = (
        id: string,
    ): OnPointerUpAction => ({ position }) => {
        if (!gridContainerRef.current) return;

        const address = coordinatesToAddress(
            position,
            gridContainerRef.current.getBoundingClientRect(),
            cellSize,
        );

        if (
            !isDuplicatedAddress(address)
            && isWithinArea({ top: position.y, left: position.x })
            && isWithinGrid(address)
        ) {
            setProcesses((prev) => prev.map(
                (process) => process.id === id
                    ? {
                        ...process,
                        step: address.column + 1,
                        priority: address.row + 1,
                    }
                    : process
            ));
            setSelectedProcessId(id);
        }

        setDraggedType(null);
        setDraggedOffset(null);
    };

    const handleGridProcessPointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        process: Process,
    ) => {
        if (!gridContainerRef.current) return;

        setDraggedType(process.type);
        setDraggedOffset(calcCellOffset(
            { top: e.clientY, left: e.clientX },
            { row: process.priority - 1, column: process.step - 1 },
            gridContainerRef.current.getBoundingClientRect(),
            cellSize,
        ));
        handlePointerDown(e, handleGridProcessPointerUp(process.id));
    };

    return (
        <div className="flex size-full">
            {draggedType && (
                <Ghost
                    ghostSize={cellSize}
                    offset={draggedOffset ?? undefined}
                >
                    <ProcessIcon type={draggedType} />
                </Ghost>
            )}
            <div className="flex-1 flex flex-col">
                <div className="flex h-12 px-4 space-x-4">
                    <div className="flex items-center">
                        <Link href="/workflow">
                            <ArrowLeft className="size-full" />
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <SaveDialogButton
                            caption="名前を付けて保存"
                            processes={processes}
                            formId={selectedFormId}
                        />
                    </div>
                    <div className="flex items-center h-full">
                        <p className="mr-2">フォーム</p>
                        <select
                            className={[
                                "block px-1 py-0.5",
                                "border border-slate-300 rounded-lg shadow-sm",
                                "hover:border-slate-400",
                            ].join(" ")}
                            value={selectedFormId}
                            onChange={(e) => setSelectedFormId(e.target.value)}
                        >
                            <option></option>
                            {forms.map((form) => (
                                <option key={form.id} value={form.id}>{form.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div ref={areaRef} className="relative flex-1 overflow-auto mx-4">
                    <div
                        ref={gridContainerRef}
                        className="absolute"
                        onClick={() => setSelectedProcessId(null)}
                    >
                        <Grid gridSize={gridSize} cellSize={cellSize} />
                    </div>
                    {processes.map((process) => {
                        const position = addressToPosition(
                            {
                                row: process.priority - 1,
                                column: process.step - 1,
                            },
                            cellSize,
                        );

                        return (
                            <div
                                key={process.id}
                                className={[
                                    "absolute p-2 cursor-move",
                                    `${process.id === selectedProcessId ? "bg-amber-100" : ""}`
                                ].join(" ")}
                                onClick={() => setSelectedProcessId(process.id)}
                                onPointerDown={(e) => handleGridProcessPointerDown(e, process)}
                                style={{
                                    ...position,
                                    ...cellSize,
                                }}
                            >
                                <ProcessIcon type={process.type} />
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center h-20 px-8 space-x-4">
                    <div
                        className="size-16 cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) => handleMenuProcessPointerDown(e, "create")}
                    >
                        <ProcessIcon type="create" />
                    </div>
                    <div
                        className="size-16 cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) => handleMenuProcessPointerDown(e, "request")}
                    >
                        <ProcessIcon type="request" />
                    </div>
                    <div
                        className="size-16 cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) => handleMenuProcessPointerDown(e, "approval")}
                    >
                        <ProcessIcon type="approval" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-80 bg-indigo-200 p-2">
                <p>{processes.length}</p>
                <p>{selectedProcessId}</p>
            </div>
        </div>
    );
};

export default WorkflowEditor;