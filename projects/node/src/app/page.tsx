"use client";

import { useEffect } from "react";
import { greet } from "@/pkg/project";

export default function Home() {
    useEffect(() => {
        greet("Hello world!");
    }, []);

    return (
        <div>

        </div>
    );
}
