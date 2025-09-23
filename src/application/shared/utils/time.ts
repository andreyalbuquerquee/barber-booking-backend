export function getWeekday(dateISO: string): number {
  const [yStr, mStr, dStr] = dateISO.split('-');
  let y = Number(yStr);
  let m = Number(mStr);
  const q = Number(dStr);
  if (m < 3) { m += 12; y -= 1; }
  const K = y % 100;
  const J = Math.floor(y / 100);
  const h = (q + Math.floor((13 * (m + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7;
  const map = {0:6,1:0,2:1,3:2,4:3,5:4,6:5} as const;
  return map[h as 0|1|2|3|4|5|6];
}

export function timeStringToMinutes(input: string): number {
  if (/^\d{2}:\d{2}$/.test(input) || /^\d{2}:\d{2}:\d{2}$/.test(input)) {
    const [h, m] = input.split(':').map(Number);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return h * 60 + m;
    throw new Error(`Invalid time: ${input}`);
  }
  const d = new Date(input);
  if (!Number.isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes();
  throw new Error(`Invalid time string: ${input}`);
}

export function minutesToHHmm(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
