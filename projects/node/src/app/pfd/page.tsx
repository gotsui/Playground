"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Pfd from "./components/Pfd";
import "@xyflow/react/dist/style.css";

const PfdPage = () => {
    return (
        <ReactFlowProvider>
            <Pfd />
        </ReactFlowProvider>
    );
};

export default PfdPage;