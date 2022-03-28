export const ping = (id: string | number | null | undefined) => (id ? `<@${id}>` : '');
