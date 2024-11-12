export function formatDateTime(date: string | Date | undefined) {
  if (date === undefined) {
    return "Unknown" || "Not Available" || null;
  }

  const dateObject = typeof date === "string" ? new Date(date) : date;
  return dateObject.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
