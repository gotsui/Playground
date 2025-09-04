"use client";

import { Handle, NodeProps, Position } from "@xyflow/react";
import { FlowchartNode } from "@/types/flowchart";

const ConditionNode = ({ data }: NodeProps<FlowchartNode>) => {
    return (
        <div className="px-4 py-2 rounded-md bg-yellow-100 border-2 border-yellow-500">
            <div className="text-lg font-bold">{data.label}</div>
            <Handle
                type="target"
                position={Position.Left}
                id="target"
                className="!w-4 !h-4 !bg-yellow-500 rounded-full"
                style={{ left: -8, top: "50%" }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="true"
                className="!w-4 !h-4 !bg-yellow-500 rounded-full"
                style={{ right: -8, top: "25%" }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="false"
                className="!w-4 !h-4 !bg-yellow-500 rounded-full"
                style={{ right: -8, top: "75%" }}
            />
        </div>
    );
};

export default ConditionNode;