import type { FormElement, Rect } from "../types";

export const createLabel = (rect: Rect): FormElement => {
    return {
        id: crypto.randomUUID(),
        name: "",
        rect,
        type: "label",
        data: {
            color: "#000000",
            value: "",
            writingMode: "horizontal-tb",
            fontSize: 16,
            backgroundColor: "#ffffff",
            disabled: false,
            hidden: false,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#000000",
            justifyContent: "start",
            alignItems: "start",
        },
    };
};

export const createInput = (rect: Rect): FormElement => {
    return {
        id: crypto.randomUUID(),
        name: "",
        rect,
        type: "input",
        data: {
            color: "#000000",
            value: "",
            writingMode: "horizontal-tb",
            fontSize: 16,
            backgroundColor: "#ffffff",
            disabled: false,
            hidden: false,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#000000",
            justifyContent: "start",
            alignItems: "start",
            editable: true,
            referenceValue: "none",
        },
    };
};
