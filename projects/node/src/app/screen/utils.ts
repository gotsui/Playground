type Range = {
    (num: number): number[];
    (begin: number, end: number): number[];
};

export const range: Range = (begin: number, end?: number) => {
    if (end === undefined) {
        return [...Array(begin)].map((_, i) => i);
    } else {
        return [...Array(end - begin)].map((_, i) => (begin + i));
    }
};