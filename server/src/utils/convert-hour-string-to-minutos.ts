export function convertHoursStringToMInutos(hoursString: string) {
  const [hours, minutos] = hoursString.split(":").map(Number);

  const minutosAmount = hours * 60 + minutos;

  return minutosAmount;
}
