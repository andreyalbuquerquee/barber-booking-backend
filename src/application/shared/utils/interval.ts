export interface Slot {
  startMin: number,
  endMin: number,
}

export function overlapsAnyMin(target: Slot, list: Slot[]): boolean {
  for (const it of list) {
    const isOverlap = target.startMin < it.endMin 
    && it.startMin < target.endMin;
      
    if (isOverlap) return true;
  }

  return false;
}