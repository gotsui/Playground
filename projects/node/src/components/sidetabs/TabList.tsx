"use client";

import { useContext } from "react";
import { TabsContext } from "./TabsContext";

type TabListProps = {
    children: React.ReactNode;
};

const TabList: React.FC<TabListProps> = ({
    children,
}) => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("TabList must be used within a TabGroup");
    }

    return (
        <div
            role="tablist"
            className="flex flex-col border-r border-gray-200"
        >
            {children}
        </div>
    );
};

export default TabList;