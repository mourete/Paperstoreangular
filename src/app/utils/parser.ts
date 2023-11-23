export function parseDateString(date: string): Date {
  // Para crear un tipo fecha con separador "/"
  const splitString = date.split('/');
  const year = parseInt(splitString[2]);
  const month = parseInt(splitString[1]) - 1;
  const day = parseInt(splitString[0]);
  const fecha = new Date(year, month, day);
  return fecha;
}

export function parseTimeString(timeString: string): Date {
  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}


