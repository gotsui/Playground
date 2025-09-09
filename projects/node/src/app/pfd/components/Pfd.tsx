"use client";

import { useCallback, useState } from "react";
import {
    addEdge,
	Background,
	DefaultEdgeOptions,
	Edge,
	MarkerType,
	NodeTypes,
	OnConnect,
	OnNodesDelete,
	OnReconnect,
	Panel,
	ReactFlow,
	reconnectEdge,
	useEdgesState,
	useNodesState,
	useReactFlow
} from "@xyflow/react";

import ProcessNode from "./nodes/ProcessNode";
import ConditionNode from "./nodes/ConditionNode";
import LoopStartNode from "./nodes/LoopStartNode";
import StartNode from "./nodes/StartNode";
import EndNode from "./nodes/EndNode";
import { Flow, PfdNode, PfdNodeData } from "../lib/types";
import { findFunctionById, pfdFunctions } from "../lib/functions";
import DndPanel from "./DndPanel";
import EditorPanel from "./EditorPanel";
import LoopEndNode from "./nodes/LoopEndNode";

const initialNodes: PfdNode[] = [
    {
        id: "start",
        position: { x: 300, y: 100 },
        data: { label: "開始", functionId: "", args: {}, returnValueName: "" },
        type: "start",
    },
    {
        id: "end",
        position: { x: 300, y: 300 },
        data: { label: "終了", functionId: "", args: {}, returnValueName: "" },
        type: "end",
    },
];
const initialEdges: Edge[] = [
    { id: "start-end", source: "start", target: "end" },
];

const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
    process: ProcessNode,
    condition: ConditionNode,
    loopStart: LoopStartNode,
    loopEnd: LoopEndNode
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    markerEnd: {
        type: MarkerType.ArrowClosed
    },
    style: {
        strokeWidth: 2,
    },
};

const Pfd = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<PfdNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
    const [selectedNode, setSelectedNode] = useState<PfdNode | null>(null);
    const [executionResult, setExecutionResult] = useState<any>(null);
    const { screenToFlowPosition } = useReactFlow();

    const onReconnect: OnReconnect = useCallback(
        (oldEdge, newConnection) =>
            setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
        [],
    );

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((els) => addEdge(params, els)),
        [],
    );

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const functionId = event.dataTransfer.getData("application/reactflow");
            const pfdFunc = findFunctionById(functionId);

            if (!pfdFunc) {
                return;
            }

            const nodeId = `n${Date.now()}`;
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: PfdNode = {
                id: nodeId,
                position,
                data: {
                    label: pfdFunc.name,
                    functionId: pfdFunc.id,
                    args: pfdFunc.args.reduce((acc, arg) => {
                        const defaultValue = arg.type === "NodeId" ? nodeId : (arg.defaultValue ?? null);
                        acc[arg.name] = defaultValue;
                        return acc;
                    }, {} as PfdNodeData["args"]),
                    returnValueName: "",
                },
                type: pfdFunc.nodeType,
            };

            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onNodeClick = useCallback((_: React.MouseEvent, node: PfdNode) => {
        setSelectedNode(node);
    }, [setSelectedNode]);

    const onNodesDelete: OnNodesDelete = useCallback((nodes) => {
        if (selectedNode && nodes.find((node) => node.id === selectedNode.id)) {
            setSelectedNode(null);
        }
    }, [selectedNode, setSelectedNode]);

    const onPaneClick = useCallback((_: React.MouseEvent) => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    const updateNode = (id: string, label: string, args: PfdNodeData["args"], returnValueName: string) => {
        setNodes((prev) => 
            prev.map((node) => 
                node.id === id ? { ...node, data: { ...node.data, label, args, returnValueName } } : node
            )
        );
    };

    const executeFlow = useCallback(async () => {
        console.log("**********************************");
        const flow: Flow = { nodes, edges };
        const resultMap = new Map<string, any>();

        const nodesMap = new Map(flow.nodes.map((node) => [node.id, node]));
        const edgesMap = new Map<string, string[]>();
        flow.edges.forEach((edge) => {
            if (!edgesMap.has(edge.source)) {
                edgesMap.set(edge.source, []);
            }

            edgesMap.get(edge.source)!.push(edge.target);
        });

        const executeNode = async (nodeId: string) => {
            const node = nodesMap.get(nodeId);

            if (!node) {
                return;
            }

            console.log("Node", node);
            console.log("Args", node.data.args);

            if (node.type === "process") {
                const pfdFunc = pfdFunctions.find((f) => f.id === node.data.functionId);
                const result = pfdFunc?.func(node.data.args);
                resultMap.set(node.data.returnValueName, result);
            } else if (node.type === "condition") {
                // TODO
            } else if (node.type === "loopStart") {
                const pfdFunc = pfdFunctions.find((f) => f.id === node.data.functionId);
                const result = pfdFunc?.func(node.data.args);
                resultMap.set(node.data.returnValueName, result);
            } else if (node.type === "loopEnd") {
                const pfdFunc = pfdFunctions.find((f) => f.id === node.data.functionId);
                const result = pfdFunc?.func(node.data.args);

                if (result) {
                    await executeNode(result);
                }

                return;
            } else {
                // 何もしない
            }

            const nextNodes = edgesMap.get(nodeId) || [];

            for (const nextNodeId of nextNodes) {
                await executeNode(nextNodeId);
            }
        };

        const startNode = flow.nodes.find((node) => node.type === "start");

        if (startNode) {
            await executeNode(startNode.id);
        }
        console.log(resultMap);

        // setExecutionResult(result);
    }, [nodes, edges]);

    return (
        <div className="w-screen h-screen flex">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodesDelete={onNodesDelete}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onPaneClick={onPaneClick}
                onReconnect={onReconnect}
                defaultEdgeOptions={defaultEdgeOptions}
                nodeTypes={nodeTypes}
                fitView
            >
                <Panel position="top-left">
                    <DndPanel />
                </Panel>
                <Panel position="top-right">
                    <EditorPanel
                        selectedNode={selectedNode}
                        updateNode={updateNode}
                        executeFlow={executeFlow}
                    />
                </Panel>
                <Background />
            </ReactFlow>
            {executionResult && (
                <div className="p-4 bg-gray-200 m-4 rounded">
                    <h3 className="font-bold">実行結果:</h3>
                    <pre>{JSON.stringify(executionResult, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Pfd;