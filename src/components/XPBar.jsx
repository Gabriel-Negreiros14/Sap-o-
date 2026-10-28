import { getLevelInfo } from '../utils/xp.js';
import { getNextStage, getPetStage } from '../utils/pet.js';

export default function XPBar({ xp }) {
  const { level, current, needed, percent } = getLevelInfo(xp);
  const stage = getPetStage(level);
  const next = getNextStage(level);

  return (
    <section className="card" aria-label="Seu Sapão: fase, nível e experiência">
      <h2 className="card-title">🐸 Seu Sapão</h2>

      <div className="mt-3 rounded-2xl bg-sapo-100 px-4 py-5 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-sapo-900">
          Fase: {stage.name}
        </p>
        <div
          role="img"
          aria-label={`Sapão na fase ${stage.name}`}
          className="my-2 inline-block cursor-pointer select-none text-7xl transition-transform duration-300 hover:animate-hop active:scale-125"
        >
          {stage.emoji}
        </div>
        <p className="text-xs text-sapo-800">{stage.hint}</p>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-lg font-bold text-sapo-900">Nível {level}</p>
        <p className="text-xs text-slate-500">Total: {xp.toLocaleString('pt-BR')} XP</p>
      </div>

      <div
        role="progressbar"
        aria-label="Progresso para o próximo nível"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-4 w-full overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-sapo-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>
          XP: {current} / {needed}
        </span>
        <span>
          {next ? `Próxima fase: ${next.emoji} no nível ${next.minLevel}` : 'Fase máxima 👑'}
        </span>
      </div>
    </section>
  );
}
