import {parseDateString, parseTimeString} from "./parser";

export function convertirAMayusculas(value_obj): void {
  const claveValue: string = value_obj.value;
  value_obj.setValue(claveValue.toUpperCase());
}

export function validarFecha(fechaMin: string, fechaMax: string): boolean {
  const castMin: Date = parseDateString(fechaMin);
  const castMax: Date = parseDateString(fechaMax);
  return castMin <= castMax;
}

export function validarHora(horaMin: string, horaMax: string): boolean {
  const castMin: Date = parseTimeString(horaMin);
  const castMax: Date = parseTimeString(horaMax);
  return castMin <= castMax;
}
