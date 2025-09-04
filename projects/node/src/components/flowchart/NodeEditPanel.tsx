"use client";

import { FlowchartNode } from "@/types/flowchart";

type NodeEditPanelProps = {
    selectedNode: FlowchartNode | null;
    nodeLabel: string;
    setNodeLabel: (label: string) => void;
    updateNodeLabel: () => void;
    deleteNode: () => void;
}

const NodeEditPanel = ({
    selectedNode,
    nodeLabel,
    setNodeLabel,
    updateNodeLabel,
    deleteNode,
}: NodeEditPanelProps) => {
    if (!selectedNode) {
        return null;
    }

    return (
        <div className="w-80 p-4 bg-white shadow-lg border-l">
            <h2 className="text-xl font-bold mb-4">編集</h2>
            <input
                type="text"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Node Label"
            />
            <div className="flex gap-2">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={updateNodeLabel}
                >
                    更新
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={deleteNode}
                >
                    削除
                </button>
            </div>
        </div>
    );
};

export default NodeEditPanel;