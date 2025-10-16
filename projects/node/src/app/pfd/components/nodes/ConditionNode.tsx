import { Handle, Position } from "@xyflow/react";
import { PfdNodeData } from "../../lib/types";
import { pfdFunctions } from "../../lib/functions";

type ConditionNodeProps = {
    data: PfdNodeData;
};

const ConditionNode = ({ data }: ConditionNodeProps) => {
    const pfdFunc = pfdFunctions.find((f) => f.id === data.functionId);

    return (
        <>
            <div className="p-4 bg-yellow-100 rounded shadow border border-yellow-300">
                <div className="font-bold">{pfdFunc?.name || "条件分岐"}</div>
                <div className="text-sm">
                    条件: {data.args.condition || "未設定"}
                </div>
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};

export default ConditionNode;