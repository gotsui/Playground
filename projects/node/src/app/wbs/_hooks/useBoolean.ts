"use client";

import { useMemo, useState } from "react";

type BooleanHandler = {
    setTrue: () => void,
    setFalse: () => void,
    toggle: () => void,
};

export const useBoolean = (initialValue: boolean = false): [boolean, BooleanHandler] => {
    const [value, setValue] = useState(initialValue);

    const handler = useMemo(
        () => ({
            setTrue: () => setValue(true),
            setFalse: () => setValue(false),
            toggle: () => setValue((prev) => !prev),
        }),
        [],
    );

    return [value, handler];
};
