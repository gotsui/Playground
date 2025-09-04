"use client";

import React, { useCallback, useState } from "react";
import {
    addEdge,
	Background,
	Controls,
	DefaultEdgeOptions,
	EdgeTypes,
	MarkerType,
	NodeTypes,
	OnConnect,
	Panel,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import ConditionNode from "./nodes/ConditionNode";
import EndNode from "./nodes/EndNode";
import ProcessNode from "./nodes/ProcessNode";
import StartNode from "./nodes/StartNode";
import { executeFlow, initialEdges, initialNodes } from "./flowchart";
import NodeEditPanel from "./NodeEditPanel";
import AddButtonEdge from "./edges/AddButtonEdge";
import { ActivityNodeType, FlowchartEdge, FlowchartNode } from "@/types/flowchart";

const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
    process: ProcessNode,
    condition: ConditionNode,
};

const edgeTypes: EdgeTypes = {
    button: AddButtonEdge,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    markerEnd: {
        type: MarkerType.ArrowClosed
    },
    style: {
        strokeWidth: 2,
    },
};

const Flowchart = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<FlowchartNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FlowchartEdge>(initialEdges);
    const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
    const [nodeLabel, setNodeLabel] = useState<string>("");

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, type: "button" }, eds)),
        [setEdges],
    );

    const onInsertNode = useCallback(
        (edge: FlowchartEdge, nodeType: ActivityNodeType) => {
            const id = `n${Date.now()}`;
            const newNode: FlowchartNode = {
                id,
                type: nodeType,
                data: { label: nodeType === "process" ? "処理" : "条件分岐" },
                position: { x: 0, y: 0 },
            };
            const newEdges: FlowchartEdge[] = [
                {
                    id: `${edge.source}-${id}`,
                    source: edge.source,
                    sourceHandle: edge.sourceHandle,
                    target: id,
                    type: "button",
                },
            ];

            if (nodeType === "condition") {
                newEdges.push({
                    id: `${id}true-${edge.target}`,
                    source: id,
                    sourceHandle: "true",
                    target: edge.target,
                    type: "button",
                });
                newEdges.push({
                    id: `${id}false-${edge.target}`,
                    source: id,
                    sourceHandle: "false",
                    target: edge.target,
                    type: "button",
                });
            } else {
                newEdges.push({
                    id: `${id}-${edge.target}`,
                    source: id,
                    target: edge.target,
                    type: "button",
                });
            }

            setNodes((nds) => [...nds, newNode]);
            setEdges((eds) => eds.filter((e) => e.id !== edge.id).concat(newEdges));
        },
        [setNodes, setEdges],
    );

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: FlowchartNode) => {
            setSelectedNode(node);
            setNodeLabel(node.data.label);
        },
        [],
    );

    const updateNodeLabel = useCallback(() => {
        if (selectedNode) {
            setNodes(
                (nds) => nds.map(
                    (n) => n.id === selectedNode.id ? { ...n, data: { ...n.data, labal: nodeLabel } } : n
                )
            );
        }
    }, [selectedNode, nodeLabel, setNodes]);

    const deleteNode = useCallback(() => {
        if (selectedNode) {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
            setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
            setSelectedNode(null);
        }
    }, [selectedNode, setNodes, setEdges]);

    const handleExecuteFlow = useCallback(() => {
        const path = executeFlow(nodes, edges);
        console.log("Flow Execution Path:", path);
    }, [nodes, edges]);

    return (
        <div className="w-screen h-screen flex">
            <ReactFlow
                nodes={nodes}
                edges={edges.map((edge) => ({
                    ...edge,
                    data: { ...edge.data, onInsert: onInsertNode },
                }))}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                defaultEdgeOptions={defaultEdgeOptions}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                className="bg-gray-50"
            >
                <Controls />
                <Background />
                <Panel position="top-left">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleExecuteFlow}
                    >
                        実行
                    </button>
                </Panel>
            </ReactFlow>
            <NodeEditPanel
                selectedNode={selectedNode}
                nodeLabel={nodeLabel}
                setNodeLabel={setNodeLabel}
                updateNodeLabel={updateNodeLabel}
                deleteNode={deleteNode}
            />
        </div>
    );
};

export default Flowchart;