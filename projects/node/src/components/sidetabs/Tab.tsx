"use client";

import { useContext } from "react";
import { TabsContext } from "./TabsContext";

type TabProps = {
    id: string;
    children: React.ReactNode;
};

const Tab: React.FC<TabProps> = ({
    id,
    children,
}) => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("Tab must be used within a TabGroup");
    }

    const { selectedTab, changeTab } = context;
    const isSelected = selectedTab === id;

    return (
        <button
            role="tab"
            aria-selected={isSelected}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            className={`
                flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200
                ${isSelected ? "border-r-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-800"}
                focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            onClick={() => changeTab(id)}
        >
            {children}
        </button>
    );
};

export default Tab;