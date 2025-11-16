export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

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

const Direction = {
    Negative: -1,
    None: -1,
    Positive: 1,
} as const;

const Anchor = {
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
    const { minSize, maxSize } = options;
    const config = HANDLE_CONFIG[handle];

    // // 現在の中心座標を取得
    // const centerX = rect.x + rect.width * 0.5;
    // const centerY = rect.y + rect.height * 0.5;

    // // 中心からの符号付き移動量(変化量)
    // const deltaX = config.scaleX * (pointer.x - centerX);
    // const deltaY = config.scaleY = (pointer.y - centerY);

    // // const newWidth = clamp(minSize?.width)(maxSize?.width)(rect.width + deltaX * 2);
    // // const newHeight = clamp(minSize?.height)(maxSize?.height)(rect.height + deltaY * 2);
    // const newWidth = rect.width + deltaX * 2;
    // const newHeight = rect.height + deltaY * 2;

    // const newX = centerX - newWidth * config.anchorX;
    // const newY = centerY - newHeight * config.anchorY;

    // 固定点の取得
    const fixedPointX = config.fixedX === "right" ? rect.x + rect.width : rect.x;
    const fixedPointY = config.fixedY === "bottom" ? rect.y + rect.height : rect.y;

    // 固定点からの距離
    // const newWidth = Math.abs(pointer.x - fixedX);
    const newWidth = config.fixedX === "center" ? rect.width : Math.abs(pointer.x - fixedPointX);
    const newHeight = config.fixedY === "center" ? rect.height : Math.abs(pointer.y - fixedPointY);

    // 座標
    const newX = config.fixedX === "right" ? fixedPointX - newWidth : fixedPointX;
    const newY = config.fixedY === "bottom" ? fixedPointY - newHeight : fixedPointY;

    console.log(rect);
    console.log(pointer.x, pointer.y);
    console.log(fixedPointX, fixedPointY);
    console.log(newWidth, newHeight);
    console.log(newX, newY);
    return { x: newX, y: newY, width: newWidth, height: newHeight };
};

const clamp = (min?: number) => (max?: number) => (value: number): number => {
    const withMin = min === undefined ? value : Math.max(value, min);
    const withMax = max === undefined ? withMin : Math.min(withMin, max);
    return withMax;
};