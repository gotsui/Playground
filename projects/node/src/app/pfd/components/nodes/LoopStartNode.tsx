import { Handle, Position } from "@xyflow/react";
import { PfdNodeData } from "../../lib/types";

type LoopNodeProps = {
    data: PfdNodeData;
};

const LoopStartNode = ({ data }: LoopNodeProps) => {
    return (
        <>
            <div className="px-4 py-2 bg-purple-100 rounded shadow border border-purple-500 hover:border-purple-600">
                <div className="font-bold">{data.label}</div>
                <div className="text-sm">
                    <div>{data.args.startIndex || "未設定"} から</div>
                    <div>{data.args.endIndex || "未設定"} まで</div>
                    <div>{data.args.step || "未設定"} 間隔でループ</div>
                </div>
            </div>
            <Handle
                type="target"
                position={Position.Top}
                id="target"
                className="!w-4 !h-4 !bg-purple-500 !rounded-full"
                style={{ top: -8 }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                className="!w-4 !h-4 !bg-purple-500 !rounded-full"
                style={{ bottom: -8 }}
            />
        </>
    );
};

export default LoopStartNode;