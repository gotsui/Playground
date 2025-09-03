"use client";

import { useContext } from "react";
import { TabsContext } from "./TabsContext";

type TabPanelProps = {
    id: string;
    children: React.ReactNode;
};

const TabPanel: React.FC<TabPanelProps> = ({
    id,
    children,
}) => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("TabPanel must be used within a TabGroup");
    }

    const { selectedTab } = context;
    const isSelected = selectedTab === id;

    return (
        <div
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            hidden={!isSelected}
            className="flex"
        >
            {children}
        </div>
    );
};

export default TabPanel;