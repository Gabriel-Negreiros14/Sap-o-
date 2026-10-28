/** Regra de XP: 10 XP a cada 100 ml registrados. */
export const XP_PER_100ML = 10;

export function xpFromMl(ml) {
  return Math.floor((ml / 100) * XP_PER_100ML);
}

/** XP necessário para sair do nível `level` e ir para o próximo. */
export function xpToNext(level) {
  return 100 + (level - 1) * 50;
}

/** Converte XP acumulado em nível, progresso dentro do nível e percentual. */
export function getLevelInfo(totalXp) {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));

  while (remaining >= xpToNext(level)) {
    remaining -= xpToNext(level);
    level += 1;
  }

  const needed = xpToNext(level);
  return {
    level,
    current: remaining,
    needed,
    percent: Math.round((remaining / needed) * 100),
  };
}
