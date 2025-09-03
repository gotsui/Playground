"use client";

import { useCallback, useState } from "react";

type UseTabsProps = {
    defaultTab?: string;
    onTabChange?: (tabId: string) => void;
};

export type TabsContextValue = {
    selectedTab: string;
    changeTab: (tabId: string) => void;
};

export const useTabs = ({
    defaultTab = "",
    onTabChange
}: UseTabsProps): TabsContextValue => {
    const [selectedTab, setSelectedTab] = useState(defaultTab);

    const changeTab = useCallback((tabId: string) => {
        setSelectedTab(tabId);

        if (onTabChange) {
            onTabChange(tabId);
        }
    }, [onTabChange]);

    return { selectedTab, changeTab };
};