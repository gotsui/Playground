"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Flowchart from "@/components/flowchart/FlowChart";
import "@xyflow/react/dist/style.css";

const FlowchartPage = () => {
    return (
        <ReactFlowProvider>
            <Flowchart />
        </ReactFlowProvider>
    );
};

export default FlowchartPage;