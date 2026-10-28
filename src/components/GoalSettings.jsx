import { useState } from 'react';
import { Check, Pencil, Target, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { MAX_GOAL, MIN_GOAL } from '../utils/user.js';

const PRESETS = [1500, 2000, 2500, 3000];

export default function GoalSettings({ goal }) {
  const { setGoal } = useApp();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(goal));
  const [error, setError] = useState('');

  const open = () => {
    setValue(String(goal));
    setError('');
    setEditing(true);
  };

  const save = (e) => {
    e?.preventDefault();
    if (setGoal(Number(value))) {
      setEditing(false);
      setError('');
    } else {
      setError(`A meta deve ficar entre ${MIN_GOAL} e ${MAX_GOAL} ml.`);
    }
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Target className="h-4 w-4 text-sapo-500" aria-hidden="true" />
          Meta diária: <strong className="text-slate-900">{goal.toLocaleString('pt-BR')} ml</strong>
        </p>
        <button type="button" onClick={open} className="btn-ghost px-2 py-1 text-sapo-700">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={save} className="space-y-2">
      <div className="flex gap-2">
        <label htmlFor="goal" className="sr-only">
          Meta diária em ml
        </label>
        <input
          id="goal"
          type="number"
          inputMode="numeric"
          min={MIN_GOAL}
          max={MAX_GOAL}
          step="50"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn-primary px-3" aria-label="Salvar meta">
          <Check className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="btn-ghost px-3"
          aria-label="Cancelar edição"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setValue(String(preset))}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-sapo-100 hover:text-sapo-700"
          >
            {preset} ml
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
