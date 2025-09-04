"use client";

import { memo, useState } from "react";
import { EdgeProps } from "@xyflow/react";
 
import ButtonEdge from "./ButtonEdge";
import { PlusCircle } from "lucide-react";
import { FlowchartEdge } from "@/types/flowchart";
 
const AddButtonEdge = memo((props: EdgeProps<FlowchartEdge>) => {
const [showSelect, setShowSelect] = useState(false);
 
  return (
        <ButtonEdge {...props}>
            <button onClick={() => setShowSelect(!showSelect)} className="bg-gray-200 hover:bg-gray-300 rounded-full">
                <PlusCircle size={20} />
            </button>
            {showSelect && (
                <div className="absolute w-24 bg-white border rounded shadow-lg">
                    <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => {
                            props.data?.onInsert?.(props, "process");
                            setShowSelect(false);
                        }}
                    >
                        処理
                    </button>
                    <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => {
                            props.data?.onInsert?.(props, "condition");
                            setShowSelect(false);
                        }}
                    >
                        条件分岐
                    </button>
                </div>
            )}
        </ButtonEdge>
  );
});
 
export default AddButtonEdge;