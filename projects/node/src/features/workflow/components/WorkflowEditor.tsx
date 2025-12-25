"use client";

import { useEffect, useRef, useState } from "react";
import { Save } from "lucide-react";

import Grid from "@/features/form/components/Grid";
import { formsSchema } from "@/features/form/schemas/form";
import { Form } from "@/features/form/types";
import useDnD, { OnPointerUpAction } from "@/hooks/useDnD";
import Ghost from "./Ghost";
import ProcessIcon from "./processes/ProcessIcon";
import { addressToPosition, coordinatesToAddress } from "../lib/grid";
import { Process } from "../types";

const initialProcesses: Process[] = [
    { id: crypto.randomUUID(), name: "開始", priority: 1, step: 1, type: "start", data: {} },
];

const WorkflowEditor = () => {
    const gridSize = { row: 15, column: 25 };
    const cellSize = { width: 80, height: 80 };
    const [processes, setProcesses] = useState<Process[]>(initialProcesses);
    const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
    const [forms, setForms] = useState<Form[]>([]);
    const [draggedType, setDraggedType] = useState<Process["type"] | null>(null);
    const { handlePointerDown } = useDnD();
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

    const handleMenuPointerUp = (
        type: Process["type"],
    ): OnPointerUpAction => ({ position }) => {
        if (!gridContainerRef.current) return;

        const address = coordinatesToAddress(
            position,
            gridContainerRef.current.getBoundingClientRect(),
            cellSize,
        );

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
        setDraggedType(null);
    };

    const handleMenuProcessPointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        type: Process["type"],
    ) => {
        setDraggedType(type);
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

        setProcesses((prev) => prev.map(
            (process) => process.id === id
                ? {
                    ...process,
                    step: address.column + 1,
                    priority: address.row + 1,
                }
                : process
        ));
        setDraggedType(null);
    };

    const handleGridProcessPointerDown = (
        e: React.PointerEvent<HTMLDivElement>,
        id: string,
        type: Process["type"],
    ) => {
        setDraggedType(type);
        handlePointerDown(e, handleGridProcessPointerUp(id));
    };

    return (
        <div className="flex size-full">
            {draggedType && (
                <Ghost size={cellSize}>
                    <ProcessIcon type={draggedType} />
                </Ghost>
            )}
            <div className="flex-1 flex flex-col">
                <div className="flex h-12 px-4 space-x-4">
                    <div className="flex items-center">
                        <Save />
                    </div>
                    <div className="flex items-center h-full">
                        <p className="mr-2">フォーム</p>
                        <select
                            className={[
                                "block px-1 py-0.5",
                                "border border-slate-300 rounded-lg shadow-sm",
                                "hover:border-slate-400",
                            ].join(" ")}
                        >
                            <option></option>
                            {forms.map((form) => (
                                <option key={form.id} value={form.id}>{form.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="relative flex-1 overflow-auto mx-4">
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
                                    "absolute p-2",
                                    `${process.id === selectedProcessId ? "bg-amber-100" : ""}`
                                ].join(" ")}
                                onClick={() => setSelectedProcessId(process.id)}
                                onPointerDown={(e) => handleGridProcessPointerDown(e, process.id, process.type)}
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
                        className="size-16"
                        onPointerDown={(e) => handleMenuProcessPointerDown(e, "create")}
                    >
                        <ProcessIcon type="create" />
                    </div>
                    <div
                        className="size-16"
                        onPointerDown={(e) => handleMenuProcessPointerDown(e, "request")}
                    >
                        <ProcessIcon type="request" />
                    </div>
                    <div
                        className="size-16"
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