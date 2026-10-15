/** Preview-only options; never accept a font family directly from the URL. */
export const fontOptions = [
  { id: 'onest', name: 'Onest', family: 'Onest', note: 'Рекомендую: спокійний, відкритий рисунок для щоденних банківських дій.', tradeoff: 'Застосовано в Personal і Business; баланс адаптується до ширини блоку.', source: 'https://github.com/google/fonts/tree/main/ofl/onest' },
  { id: 'manrope', name: 'Manrope', family: 'Manrope', note: 'М’яка геометрія: дружній, сучасний характер інтерфейсу.', tradeoff: 'Ширший рисунок — довгі підписи варто перевіряти уважніше.', source: 'https://github.com/google/fonts/tree/main/ofl/manrope' },
  { id: 'plex', name: 'IBM Plex Sans', family: 'IBM Plex Sans', note: 'Точний, діловий характер для таблиць і фінансових даних.', tradeoff: 'Виразніші деталі літер; пара виглядає більш технічною.', source: 'https://github.com/IBM/plex' },
] as const;
export function resolvePreviewFont(id: string | null) {
  return fontOptions.find(font => font.id === id) ?? null;
}
