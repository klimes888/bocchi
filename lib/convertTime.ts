export function formatTimestamp({
  seconds,
  nanoseconds,
}: {
  seconds: number;
  nanoseconds: number;
}) {
  const date = new Date(seconds * 1000 + Math.floor(nanoseconds / 1_000_000));

  const pad = (n: number) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 0-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const secondsStr = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${secondsStr}`;
}
