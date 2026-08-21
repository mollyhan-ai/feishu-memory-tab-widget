export function getInitialCard(rawValue, cardCount) {
  const index = Number(rawValue);
  if (!Number.isInteger(index) || index < 0 || index >= cardCount) return 0;
  return index;
}

export function normalizeDeck(value) {
  if (!value || typeof value !== 'object') return { title: '可切换卡片', cards: [] };

  const cards = Array.isArray(value.cards)
    ? value.cards
      .filter(card => card && typeof card === 'object')
      .map((card, index) => ({
        id: String(card.id || `card-${index + 1}`),
        title: String(card.title || `卡片 ${index + 1}`),
        content: String(card.content || ''),
        tone: String(card.tone || ['lavender', 'blue', 'peach', 'green', 'purple'][index % 5])
      }))
    : [];

  return {
    title: String(value.title || '可切换卡片'),
    subtitle: String(value.subtitle || '点击上方标题，切换查看不同内容。'),
    displayMode: ['pills', 'bar', 'side'].includes(value.displayMode) ? value.displayMode : 'pills',
    cards
  };
}

export function normalizeRecord(record, cardCount) {
  if (!record || typeof record !== 'object') return {};
  return { activeCard: getInitialCard(record.activeCard, cardCount) };
}
