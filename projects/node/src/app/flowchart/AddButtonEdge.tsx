import { EdgeProps, useReactFlow } from "@xyflow/react";
import { memo } from "react";
 
import { PlusCircle } from "lucide-react";
import { ButtonEdge } from "./ButtonEdge";
import getLayoutedElements from "./layoutElements";

const AddButtonEdge = memo((props: EdgeProps) => {
    const { getNodes, getEdges, setNodes, setEdges, addNodes, addEdges, deleteElements } = useReactFlow();

    const onEdgeClick = (props: EdgeProps) => {
        const newNodeId = `n${Date.now()}`;
        const newNode = { id: newNodeId, position: { x: 0, y: 0 }, data: { label: "関数" }, type: "default" };
        const upstreamEdge = { id: `${props.source}-${newNodeId}`, source: props.source, target: newNodeId, type: "button" };
        const downstreamEdge = { id: `${newNodeId}-${props.target}`, source: newNodeId, target: props.target, type: "button" };

        deleteElements({ edges: [{ id: props.id }]});
        addNodes(newNode);
        addEdges([upstreamEdge, downstreamEdge]);

        setTimeout(() => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(getNodes(), getEdges());
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
        }, 0);
    };

    return (
        <ButtonEdge {...props}>
            <button onClick={() => onEdgeClick(props)} className="bg-white">
                <PlusCircle size={16} />
            </button>
        </ButtonEdge>
    );
});
 
export default AddButtonEdge;