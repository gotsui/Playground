"use client";

import { TabsContext } from "./TabsContext";
import { useTabs } from "./useTabs";

type TabGroupProps = {
    children: React.ReactNode;
    defaultTab?: string;
    onTabChange?: (tabId: string) => void;
};

const TabGroup: React.FC<TabGroupProps> = ({
    children,
    defaultTab,
    onTabChange,
}) => {
    const tabsContext = useTabs({ defaultTab, onTabChange });

    return (
        <TabsContext value={tabsContext}>
            <div className="flex">
                {children}
            </div>
        </TabsContext>
    );
};

export default TabGroup;