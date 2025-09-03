"use client";

import { ReactFlowProvider } from "@xyflow/react";
import FlowchartEditor from "./FlowchartEditor";
import "@xyflow/react/dist/style.css";

const Home = () => {
    return (
        <ReactFlowProvider>
            <div className="flex flex-col h-screen w-screen">
                <FlowchartEditor />
            </div>
        </ReactFlowProvider>
    );
};

export default Home;