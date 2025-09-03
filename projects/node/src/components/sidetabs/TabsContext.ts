"use client";

import { createContext } from "react";
import { TabsContextValue } from "./useTabs";

export const TabsContext = createContext<TabsContextValue | undefined>(undefined);