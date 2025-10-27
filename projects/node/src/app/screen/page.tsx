"use client";

import ScreenLayout from "./_components/ScreenLayout";
import DnDProvider from "./_components/DnDProvider";
import GridProvider from "./_components/GridProvider";

const ScreenPage = () => {
    return (
        <DnDProvider>
            <ScreenLayout/>
        </DnDProvider>
    );
};

export default ScreenPage;