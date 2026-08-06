import type { Rect } from "../types";

export type Point = {
    x: number;
    y: number;
};

export type Handle =
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "middleLeft"
    | "middleRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight";

const _Direction = {
    Negative: -1,
    None: -1,
    Positive: 1,
} as const;

const _Anchor = {
    Start: 1,
    Center: 0.5,
    End: 0,
} as const;

type HandleConfig = {
    [K in Handle]: {
        fixedX: "left" | "center" | "right";
        fixedY: "top" | "center" | "bottom";
    };
};

// const HANDLE_CONFIG: Record<Handle, { fixedX: "right", fixedY: "top" }> = {
const HANDLE_CONFIG: HandleConfig = {
    topLeft: { fixedX: "right", fixedY: "bottom" },
    topCenter: { fixedX: "center", fixedY: "bottom" },
    topRight: { fixedX: "left", fixedY: "bottom" },
    middleLeft: { fixedX: "right", fixedY: "center" },
    middleRight: { fixedX: "left", fixedY: "center" },
    bottomLeft: { fixedX: "right", fixedY: "top" },
    bottomCenter: { fixedX: "center", fixedY: "top" },
    bottomRight: {fixedX: "left", fixedY: "top" },
} as const;

export const resizeRect = (
    rect: Rect,
    handle: Handle,
    pointer: Point,
    options: {
        minSize?: {
            width: number;
            height: number;
        };
        maxSize?: {
            width: number;
            height: number;
        };
    } = {},
): Rect => {
    const { minSize: _minSize, maxSize: _maxSize } = options;
    const config = HANDLE_CONFIG[handle];

    // 固定点の取得
    const fixedPointX = config.fixedX === "right" ? rect.left + rect.width : rect.left;
    const fixedPointY = config.fixedY === "bottom" ? rect.top + rect.height : rect.top;

    // 固定点からの距離
    const newWidth = config.fixedX === "center" ? rect.width : Math.abs(pointer.x - fixedPointX);
    const newHeight = config.fixedY === "center" ? rect.height : Math.abs(pointer.y - fixedPointY);

    // 座標
    const newX = config.fixedX === "right" ? fixedPointX - newWidth : fixedPointX;
    const newY = config.fixedY === "bottom" ? fixedPointY - newHeight : fixedPointY;

    return { left: newX, top: newY, width: newWidth, height: newHeight };
};

const _clamp = (min?: number) => (max?: number) => (value: number): number => {
    const withMin = min === undefined ? value : Math.max(value, min);
    const withMax = max === undefined ? withMin : Math.min(withMin, max);
    return withMax;
};