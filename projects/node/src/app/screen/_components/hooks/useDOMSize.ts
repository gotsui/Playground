"use client";

import { useCallback, useState } from "react";

export type Rect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

const useDOMSize = () => {
    const [rect, setRect] = useState<Rect>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    const ref = useCallback((element: HTMLElement | null) => {
        if (!element) return;

        // 初期サイズをセット
        setRect({
            top: element.offsetTop,
            left: element.offsetLeft,
            width: element.offsetWidth,
            height: element.offsetHeight,
        });

        const observer = new ResizeObserver(() => {
            setRect({
                top: element.offsetTop,
                left: element.offsetLeft,
                width: element.offsetWidth,
                height: element.offsetHeight,
            });
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return { ref, rect };
};

export default useDOMSize;