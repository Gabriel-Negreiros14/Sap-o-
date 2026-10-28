/** Chave de data local (YYYY-MM-DD) baseada no relógio do navegador. */
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Últimos `n` dias (do mais antigo ao mais recente, terminando hoje). */
export function lastNDays(n) {
  const days = [];
  const base = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    days.push(todayKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() - i)));
  }
  return days;
}

export function weekdayLabel(key) {
  return keyToDate(key)
    .toLocaleDateString('pt-BR', { weekday: 'short' })
    .replace('.', '');
}

export function dayMonthLabel(key) {
  return keyToDate(key).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
