"use client";

import { pfdFunctions } from "../lib/functions";

const DndPanel = () => {
    const onDragStart = (event: React.DragEvent, functionId: string) => {
        event.dataTransfer.setData("application/reactflow", functionId);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="w-64 p-4 bg-gray-100 rounded shadow max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">ノード</h2>
            <div className="flex flex-col gap-2">
                {pfdFunctions.map((func) => (
                    <div
                        key={func.id}
                        className="p-2 bg-blue-500 text-white rounded cursor-move"
                        draggable
                        onDragStart={(e) => onDragStart(e, func.id)}
                    >
                        {func.name}
                    </div>
                ))}
                {/* <div
                    className="p-2 bg-blue-500 text-white rounded cursor-move"
                    draggable
                    onDragStart={(e) => onDragStart(e, "process")}
                >
                    Process Node
                </div>
                <div
                    className="p-2 bg-yellow-500 text-white rounded cursor-move"
                    draggable
                    onDragStart={(e) => onDragStart(e, "condition")}
                >
                    Condition Node
                </div>
                <div
                    className="p-2 bg-purple-500 text-white rounded cursor-move"
                    draggable
                    onDragStart={(e) => onDragStart(e, "loop")}
                >
                    Loop Node
                </div>
                <div
                    className="p-2 bg-green-500 text-white rounded cursor-move"
                    draggable
                    onDragStart={(e) => onDragStart(e, "start")}
                >
                    Start Node
                </div>
                <div
                    className="p-2 bg-red-500 text-white rounded cursor-move"
                    draggable
                    onDragStart={(e) => onDragStart(e, "end")}
                >
                    End Node
                </div> */}
            </div>
        </div>
    );
};

export default DndPanel;