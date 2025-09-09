import { Handle, Position } from "@xyflow/react";
import { PfdNodeData } from "../../lib/types";

type StartNodeProps = {
    data: PfdNodeData;
};

const StartNode = ({ data }: StartNodeProps) => {
    return (
        <>
            <div className="px-4 py-2 rounded-full bg-green-100 border-2 border-green-500 hover:border-green-600">
                <div className="font-bold">{data.label}</div>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                className="!w-4 !h-4 !bg-green-500 !rounded-full"
                style={{ bottom: -8 }}
            />
        </>
    );
};

export default StartNode;