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