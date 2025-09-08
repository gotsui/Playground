import { Handle, Position } from "@xyflow/react";
import { PfdNodeData } from "../../lib/types";

type EndNodeProps = {
    data: PfdNodeData;
};

const EndNode =({ data }: EndNodeProps) => {
    return (
        <>
            <div className="px-4 py-2 rounded-full bg-red-100 border-2 border-red-500 hover:border-red-600">
                <div className="font-bold">{data.label}</div>
            </div>
            <Handle
                type="target"
                position={Position.Top}
                id="target"
                className="!w-4 !h-4 !bg-red-500 rounded-full"
                style={{ top: -8 }}
            />
        </>
    );
};

export default EndNode;