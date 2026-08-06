"use client";

import ResizeHandle from "./ResizeHandle";
import { Handle } from "../lib/resize";
import { FormElement as FormElementType } from "../types";

type Props = {
    element: FormElementType;
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onPointerDownElement: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerDownHandle: (e: React.PointerEvent<HTMLDivElement>, element: FormElementType, handle: Handle) => void;
    isSelected?: boolean;
};

const FormElement = ({
    element,
    onClick,
    onPointerDownElement,
    onPointerDownHandle,
    isSelected = false,
}: Props) => {
    return (
        <>
            <div
                key={element.id}
                className={[
                    "absolute flex",
                    `${isSelected ? "cursor-move" : "cursor-pointer"}`,
                ].join(" ")}
                style={{
                    ...element.rect,
                    ...element.data,
                }}
                onClick={onClick}
                onPointerDown={
                    isSelected
                    ? onPointerDownElement
                    : undefined
                }
            >
                {element.data.value}
            </div>
            {/* <svg width={element.rect.width} height={element.rect.height} style={{ top: element.rect.top, left: element.rect.left }} xmlns="http://www.w3.org/2000/svg"
            className={`bg-blue-300 absolute ${isSelected ? "cursor-move" : "cursor-pointer"}`} onClick={onClick} onPointerDown={isSelected ? onPointerDownElement : undefined}>
                <rect x={0} y={0} width={element.rect.width} height={element.rect.height} fill={element.data.backgroundColor} />
            </svg>
            {isSelected && (
                <ResizeHandle
                    element={element}
                    onPointerDown={onPointerDownHandle}
                />
            )} */}
        </>
    );
};

export default FormElement;