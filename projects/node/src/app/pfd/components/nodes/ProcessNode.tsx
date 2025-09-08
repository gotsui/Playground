import { Handle, Position } from "@xyflow/react";
import { PfdNodeData } from "../../lib/types";

type ProcessNodeProps = {
    data: PfdNodeData;
};

const ProcessNode = ({ data }: ProcessNodeProps) => {
    return (
        <>
            <div className="px-4 py-2 rounded-md bg-blue-100 border-2 border-blue-500 hover:border-blue-600">
                <div className="font-bold">{data.label}</div>
                {Object.entries(data.args).map(([key, value]) => (
                    <div key={key} className="text-sm">
                        {key}: {value}
                    </div>
                ))}
            </div>
            <Handle
                type="target"
                position={Position.Top}
                id="target"
                className="!w-4 !h-4 !bg-blue-500 rounded-full"
                style={{ top: -8 }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                className="!w-4 !h-4 !bg-blue-500 rounded-full"
                style={{ bottom: -8 }}
            />
        </>
    );
};

export default ProcessNode;