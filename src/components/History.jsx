import { CalendarDays } from 'lucide-react';
import { dayMonthLabel, lastNDays, todayKey, weekdayLabel } from '../utils/date.js';

const DAYS = 7;

export default function History({ user }) {
  const today = todayKey();

  const days = lastNDays(DAYS).map((key) => {
    const isToday = key === today;
    const entry = user.history[key];
    return {
      key,
      isToday,
      ml: isToday ? user.todayMl : entry?.ml ?? 0,
      goal: isToday ? user.dailyGoal : entry?.goal ?? user.dailyGoal,
    };
  });

  const max = Math.max(1, ...days.map((d) => Math.max(d.ml, d.goal)));
  const total = days.reduce((sum, d) => sum + d.ml, 0);
  const metGoal = days.filter((d) => d.ml >= d.goal).length;

  return (
    <section className="card" aria-label="Histórico dos últimos 7 dias">
      <h2 className="card-title">
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Últimos {DAYS} dias
      </h2>

      <div className="mt-4 flex items-end gap-1.5 sm:gap-3" role="list">
        {days.map((d) => {
          const height = d.ml > 0 ? Math.max(4, Math.round((d.ml / max) * 100)) : 0;
          const reached = d.ml >= d.goal;
          return (
            <div
              key={d.key}
              role="listitem"
              aria-label={`${dayMonthLabel(d.key)}: ${d.ml} ml`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                {d.ml > 0 ? (d.ml / 1000).toFixed(1).replace('.', ',') : '–'}
              </span>
              <div className="flex h-28 w-full items-end justify-center rounded-lg bg-slate-50">
                <div
                  className={`w-full max-w-[40px] rounded-t-lg transition-all duration-700 ${
                    reached ? 'bg-emerald-400' : 'bg-sky-400'
                  } ${d.isToday ? 'opacity-100' : 'opacity-80'}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span
                className={`text-xs capitalize ${
                  d.isToday ? 'font-bold text-sky-700' : 'text-slate-500'
                }`}
              >
                {d.isToday ? 'Hoje' : weekdayLabel(d.key)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          Média: <strong className="text-slate-700">{Math.round(total / DAYS)} ml/dia</strong>
        </span>
        <span>
          Metas batidas:{' '}
          <strong className="text-slate-700">
            {metGoal}/{DAYS}
          </strong>
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> meta
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-sky-400" /> abaixo
          </span>
        </span>
      </div>
    </section>
  );
}
