export function parseDateString(date: string): Date {
  // Para crear un tipo fecha con separador "/"
  const splitString = date.split('/');
  const year = parseInt(splitString[2]);
  const month = parseInt(splitString[1]) - 1;
  const day = parseInt(splitString[0]);
  const fecha = new Date(year, month, day);
  return fecha;
}
