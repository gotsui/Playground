export const dateToString = (date: Date, locale: string = "ja-JP"): string => {
    return date.toLocaleDateString(locale, {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

export const datetimeToString = (date: Date, locale: string = "ja-JP"): string => {
    return date.toLocaleString(locale, {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};