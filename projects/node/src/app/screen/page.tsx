"use client";

import ScreenLayout from "./_components/ScreenLayout";
import DnDProvider from "./_components/DnDProvider";
import GridProvider from "./_components/GridProvider";

const ScreenPage = () => {
    return (
        <DnDProvider>
            <GridProvider>
                <ScreenLayout/>
            </GridProvider>
        </DnDProvider>
    );
};

export default ScreenPage;