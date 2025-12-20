import { Rect } from "../types";
import { XYPosition } from "./useDnD";

export const calcRelativePosition = (position: XYPosition, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();

    return {
        x: position.x - rect.left + element.scrollLeft,
        y: position.y - rect.top + element.scrollTop,
    };
};

export const calcOffset = (position: XYPosition, rect: Rect) => {
    return {
        x: rect.left - position.x,
        y: rect.top - position.y,
    };
};
