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

export function validarHora(horaMin: string, horaMax: string): boolean {
  const castMin: Date = parseTimeString(horaMin);
  const castMax: Date = parseTimeString(horaMax);
  return castMin <= castMax;
}
