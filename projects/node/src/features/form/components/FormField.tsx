"use client";

import { Handle } from "../lib/resize";
import { Field } from "../types";
import ResizeHandle from "./ResizeHandle";

type Props = {
    field: Field;
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onPointerDownField: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerDownHandle: (e: React.PointerEvent<HTMLDivElement>, field: Field, handle: Handle) => void;
    isSelected?: boolean;
};

const FormField = ({
    field,
    onClick,
    onPointerDownField,
    onPointerDownHandle,
    isSelected = false,
}: Props) => {
    return (
        <>
            <div
                key={field.id}
                className={[
                    "absolute flex",
                    `${isSelected ? "cursor-move" : "cursor-pointer"}`,
                ].join(" ")}
                style={{
                    ...field.rect,
                    ...field.data,
                }}
                onClick={onClick}
                onPointerDown={
                    isSelected
                    ? onPointerDownField
                    : undefined
                }
            >
                {field.data.value}
            </div>
            {isSelected && (
                <ResizeHandle
                    field={field}
                    onPointerDown={onPointerDownHandle}
                />
            )}
        </>
    );
};

export default FormField;