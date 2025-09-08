"use client";

import { useState, useEffect } from "react";
import { PfdNode, PfdNodeData } from "../lib/types";
import { findFunctionById, pfdFunctions } from "../lib/functions";

type EditorPanelProps = {
    selectedNode: PfdNode | null;
    updateNode: (id: string, label: string, args: PfdNodeData["args"], returnValueName: string) => void;
    executeFlow: () => void;
};

const EditorPanel = ({ selectedNode, updateNode, executeFlow }: EditorPanelProps) => {
    const [label, setLabel] = useState("");
    const [args, setArgs] = useState<PfdNodeData["args"]>({});
    const [returnValueName, setReturnValueName] = useState("");

    useEffect(() => {
        if (selectedNode) {
            setLabel(selectedNode.data.label);
            setArgs(selectedNode.data.args);
            setReturnValueName(selectedNode.data.returnValueName);
        } else {
            setLabel("");
            setArgs({});
            setReturnValueName("");
        }
    }, [selectedNode]);

    if (!selectedNode) {
        return null;
    }

    if (selectedNode.type === "start" || selectedNode.type === "end" || selectedNode.type === "loopEnd") {
        return null;
    }

    const pfdFunc = findFunctionById(selectedNode.data.functionId);

    if (!pfdFunc) {
        return <div>データが登録されていません</div>;;
    }

    return (
        <div className="w-80 p-4 bg-gray-100 rounded shadow max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">ノード編集</h2>
            <h2 className="text-lg font-bold mb-4">{pfdFunc.name}</h2>
            <div className="mb-2">
                <label htmlFor={`${pfdFunc.id}-label`} className="block text-sm">処理名</label>
                <input
                    id={`${pfdFunc.id}-label`}
                    type="text"
                    className="p-2 border rounded w-full"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
            </div>
            {pfdFunc.args.map((arg) => {
                if (arg.type !== "NodeId") {
                    return (
                        <div key={arg.name} className="mb-2">
                            <label htmlFor={`${pfdFunc.id}-${arg.name}`} className="block text-sm">{arg.label}</label>
                            {arg.type === "textarea" ? (
                                <textarea
                                    id={`${pfdFunc.id}-${arg.name}`}
                                    className="p-2 border rounded w-full"
                                    value={(args[arg.name] || arg.defaultValue || "").toString()}
                                    onChange={(e) => setArgs((prev) => ({ ...prev, [arg.name]: e.target.value }))}
                                />
                            ) : arg.type === "select" ? (
                                <select
                                    id={`${pfdFunc.id}-${arg.name}`}
                                    className="p-2 border rounded w-full"
                                    value={(args[arg.name] || arg.defaultValue || "").toString()}
                                    onChange={(e) => setArgs((prev) => ({ ...prev, [arg.name]: e.target.value }))}
                                >
                                    {arg.options?.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    id={`${pfdFunc.id}-${arg.name}`}
                                    type={arg.type}
                                    className="p-2 border rounded w-full"
                                    value={(args[arg.name] || arg.defaultValue || "").toString()}
                                    onChange={(e) =>
                                        setArgs((prev) => ({
                                            ...prev,
                                            [arg.name]: arg.type === "number" ? Number(e.target.value) : e.target.value,
                                        }))
                                    }
                                />
                            )}
                        </div>
                    );
                }
            })}
            <div className="mb-2">
                <label htmlFor={`${pfdFunc.id}-return`} className="block text-sm">戻り値名</label>
                <input
                    id={`${pfdFunc.id}-return`}
                    type="text"
                    className="p-2 border rounded w-full"
                    value={returnValueName}
                    onChange={(e) => setReturnValueName(e.target.value)}
                />
            </div>
            <button
                className="p-2 bg-blue-500 text-white rounded mt-2 w-full"
                onClick={() => updateNode(selectedNode.id, label || "", args, returnValueName)}
            >
                保存
            </button>
            <div className="mt-4">
                <button
                    className="p-2 bg-green-600 text-white rounded w-full"
                    onClick={executeFlow}
                >
                    Execute Flow
                </button>
            </div>
        </div>
    );
};

export default EditorPanel;