export const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export const persen = new Intl.NumberFormat("id-ID", {
  style: "percent",
});

export const readableDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
});
