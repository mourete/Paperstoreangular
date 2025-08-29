import {parseDateString, parseTimeString} from "./parser";

export function convertirAMayusculas(value_obj): void {
  const claveValue: string = value_obj.value;
  value_obj.setValue(claveValue.toUpperCase());
}

export function validarFecha(fechaMinStr: string, fechaMaxStr: string): boolean {

  if (!fechaMinStr || !fechaMaxStr || typeof fechaMinStr !== 'string' || typeof fechaMaxStr !== 'string') {
    return true;
  }
  const parsearFecha = (fechaStr: string): Date | null => {
    const parts = fechaStr.split('/');
    if (parts.length !== 3) {
      return null;
    }
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }

    return new Date(year, month, day);
  };

  try {
    const fechaMin = parsearFecha(fechaMinStr);
    const fechaMax = parsearFecha(fechaMaxStr);

    if (!fechaMin || !fechaMax) {
      return true;
    }

    return fechaMin <= fechaMax;
  } catch (e) {
    console.error("Error al procesar fechas:", e);
    return true;
  }
}

export function validarHora(horaMinStr: string, horaMaxStr: string): boolean {
  if (!horaMinStr || !horaMaxStr || typeof horaMinStr !== 'string' || typeof horaMaxStr !== 'string') {
    return true;
  }
  const parsearHora = (horaStr: string): Date | null => {
    const parts = horaStr.split(':');
    if (parts.length !== 2) {
      return null;
    }
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    return new Date(1970, 0, 1, hours, minutes);
  };

  try {
    const horaMin = parsearHora(horaMinStr);
    const horaMax = parsearHora(horaMaxStr);

    if (!horaMin || !horaMax) {
      return true;
    }
    return horaMin <= horaMax;
  } catch (e) {
    console.error("Error al procesar horas:", e);
    return true;
  }
}
