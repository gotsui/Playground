"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";
import { FlowchartNode } from "@/types/flowchart";

const StartNode = ({ data }: NodeProps<FlowchartNode>) => {
    return (
        <div className="px-4 py-2 rounded-full bg-green-100 border-2 border-green-500">
            <div className="text-lg font-bold">{data.label}</div>
            <Handle
                type="source"
                position={Position.Right}
                id="source"
                className="!w-4 !h-4 !bg-green-500 rounded-full"
                style={{ right: -8, top: "50%" }}
            />
        </div>
    );
};

export default StartNode;