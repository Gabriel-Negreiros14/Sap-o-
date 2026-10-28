/**
 * Fases de evolução do Sapão (herdadas do protótipo "Sapinho Hidratado").
 * A fase depende do nível: quanto mais água, mais o sapo evolui.
 */
export const PET_STAGES = [
  { minLevel: 1, name: 'Girino', emoji: '🐟', hint: 'Acabou de nascer na lagoa.' },
  { minLevel: 2, name: 'Crescendo Pernas', emoji: '🦎', hint: 'Já está ganhando pernas!' },
  { minLevel: 3, name: 'Sapinho Jovem', emoji: '🐸', hint: 'Pulando de vitória em vitória.' },
  { minLevel: 4, name: 'Sapo Rei', emoji: '👑🐸', hint: 'O soberano da lagoa.' },
];

export function getPetStage(level) {
  let stage = PET_STAGES[0];
  for (const s of PET_STAGES) {
    if (level >= s.minLevel) stage = s;
  }
  return stage;
}

/** Próxima fase ainda não alcançada (ou null se já é o Sapo Rei). */
export function getNextStage(level) {
  return PET_STAGES.find((s) => s.minLevel > level) ?? null;
}
