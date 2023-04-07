export const rupiah = new Intl.NumberFormat(
    "id-ID",
    {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }
);

export const persen = new Intl.NumberFormat(
    "id-ID",
    {
        style: "percent"
    }
);

export const readableDate = new Intl.DateTimeFormat(
    "id-ID",
    {
        dateStyle: "medium"
    }
);