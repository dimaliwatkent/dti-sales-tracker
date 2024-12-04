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

export function formatNotificationTime(date: string | Date | undefined) {
  if (date === undefined) {
    return "Unknown";
  }

  const dateObject = typeof date === "string" ? new Date(date) : date;
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }),
  );
  const diffTime = Math.abs(now.getTime() - dateObject.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
      } else {
        return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      }
    } else if (diffDays === 1) {
      return `1 day ago`;
    } else {
      return `${diffDays} days ago`;
    }
  } else {
    return dateObject.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
}
