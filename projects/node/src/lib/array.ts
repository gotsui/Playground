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

export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] => {
    return array.reduce<[T[], T[]]>(
        (acc, item) => {
            acc[predicate(item) ? 0 : 1].push(item);
            return acc;
        },
        [[], []]
    );
};

export const trim = <T>(array: (T | null | undefined)[]): T[] => {
    return array.filter((item): item is Exclude<typeof item, null | undefined> => item != null);
};
