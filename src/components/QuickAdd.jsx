import { useEffect, useRef, useState } from 'react';
import { GlassWater, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { MAX_SINGLE_INTAKE } from '../utils/user.js';

const QUICK_AMOUNTS = [200, 300, 500];

export default function QuickAdd() {
  const { addWater } = useApp();
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');
  const [gain, setGain] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const add = (ml) => {
    const result = addWater(ml);
    if (!result) {
      setError(`Informe um valor entre 1 e ${MAX_SINGLE_INTAKE} ml.`);
      return false;
    }
    setError('');
    setGain({ xp: result.gained, ml, key: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setGain(null), 1500);
    return true;
  };

  const submitCustom = (e) => {
    e.preventDefault();
    if (add(Number(custom))) setCustom('');
  };

  return (
    <div>
      <div className="relative mb-2 h-5">
        {gain && (
          <p
            key={gain.key}
            className="absolute right-0 top-0 animate-float-up text-sm font-bold text-amber-600"
            aria-live="polite"
          >
            +{gain.ml} ml · +{gain.xp} XP
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {QUICK_AMOUNTS.map((ml) => (
          <button
            key={ml}
            type="button"
            onClick={() => add(ml)}
            className="btn-primary flex-col gap-0.5 py-3"
          >
            <GlassWater className="h-5 w-5" aria-hidden="true" />
            <span>+{ml} ml</span>
          </button>
        ))}
      </div>

      <form onSubmit={submitCustom} className="mt-3 flex gap-2">
        <label htmlFor="custom-ml" className="sr-only">
          Valor personalizado em ml
        </label>
        <input
          id="custom-ml"
          type="number"
          inputMode="numeric"
          min="1"
          max={MAX_SINGLE_INTAKE}
          step="1"
          className="input"
          placeholder="Outro valor (ml)"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
        />
        <button type="submit" className="btn-soft shrink-0" disabled={!custom}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Adicionar
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
