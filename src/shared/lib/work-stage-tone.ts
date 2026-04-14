export function isLightWorkStageCard(index: number, columns: number) {
  const safeColumns = Math.max(1, columns);
  const row = Math.floor(index / safeColumns);
  const col = index % safeColumns;

  return (row + col) % 2 === 0;
}
