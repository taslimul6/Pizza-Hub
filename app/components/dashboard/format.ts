// Number and date formats used on the dashboards

export const formatNumber = (value: number) => value.toLocaleString("en-US");

export const formatMoney = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Whole percent, 0 when there is nothing to divide by
export const percent = (part: number, whole: number) =>
  whole === 0 ? 0 : Math.round((part / whole) * 100);

// "Nov 21"
export const formatShortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
