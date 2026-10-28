export default function WaterProgress({ current, goal }) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  const reached = current >= goal;

  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-slate-900">
          {current.toLocaleString('pt-BR')}
          <span className="ml-1 text-base font-medium text-slate-500">ml</span>
        </p>
        <p className={`text-2xl font-bold ${reached ? 'text-emerald-600' : 'text-sky-600'}`}>
          {pct}%
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Progresso da meta diária"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-3 h-5 w-full overflow-hidden rounded-full bg-sky-100"
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${
            reached ? 'from-emerald-400 to-green-500' : 'from-sky-400 to-cyan-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {reached
          ? '🎉 Meta do dia batida! Cada ml extra continua rendendo XP.'
          : `Faltam ${(goal - current).toLocaleString('pt-BR')} ml para a meta de ${goal.toLocaleString('pt-BR')} ml.`}
      </p>
    </div>
  );
}
