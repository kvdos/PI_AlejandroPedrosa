// Formateo de la fecha y hora
export const formatDateTime = (timestamp) => {
  const dtFormat = new Intl.DateTimeFormat("standard", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  //
  const dateTime = new Date(timestamp);
  const dateTimeFormatted = dtFormat.format(dateTime).split(", ");
  return dateTimeFormatted[1] + " · " + dateTimeFormatted[0];
};
