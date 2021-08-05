export function formatOMWDate(dt: number) {
  return new Date(dt * 1000).toLocaleDateString(["en"], {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    weekday: "long",
  });
}
