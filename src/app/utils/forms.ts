
export function convertirAMayusculas(value_obj): void {
  const claveValue: string = value_obj.value;
  value_obj.setValue(claveValue.toUpperCase());
}
