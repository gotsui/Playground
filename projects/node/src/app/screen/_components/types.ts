import { CellAddress } from "./hooks/useGrid";

export type Size = {
    width: number;
    height: number;
};;

export type Item = {
    id: string;
    label: string;
    size: Size;
};

export type Elm = {
    id: string;
    item: Item;
    address: CellAddress;
    size: Size;
    property: {
        label: string;
        type: string;
    };
};

// export type HandleDirection = "nw" | "n" | "ne" | "w" | "e" | "sw" | "s" | "se";
export type HandleDirection =
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "middleLeft"
    | "middleRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight";
