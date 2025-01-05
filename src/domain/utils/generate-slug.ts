export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '') // Reemplaza espacios por
    .replace(/[^\w\-]+/g, '') // Elimina todos los caracteres no alfanuméricos
    .replace(/\-\-+/g, '-') // Reemplaza múltiples - por uno solo
    .replace(/^-+/, '') // Elimina - al inicio
    .replace(/-+$/, ''); // Elimina - al final
};
