export function convertMinutosToHourString(minutosAmount: number) {
  const hours = Math.floor(minutosAmount / 60);
  const minutos = minutosAmount % 60;

  return `${String(hours).padStart(2,'0')}:${String(minutos).padStart(2,'0')}`;
}
