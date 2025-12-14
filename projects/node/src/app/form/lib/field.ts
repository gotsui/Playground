import { Field, Rect } from "../types";

export const createLabel = (rect: Rect): Field => {
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
