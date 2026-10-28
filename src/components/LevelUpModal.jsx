import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getPetStage } from '../utils/pet.js';
import { playLevelUp } from '../utils/sound.js';

export default function LevelUpModal() {
  const { levelUp, dismissLevelUp, currentUser } = useApp();
  const soundEnabled = currentUser?.soundEnabled;

  useEffect(() => {
    if (!levelUp) return undefined;
    if (soundEnabled) playLevelUp();
    const id = setTimeout(dismissLevelUp, 4500);
    return () => clearTimeout(id);
  }, [levelUp, soundEnabled, dismissLevelUp]);

  if (!levelUp) return null;

  const stage = getPetStage(levelUp.level);
  const before = getPetStage(levelUp.from);
  const evolved = stage.name !== before.name;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Level up! Nível ${levelUp.level}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-fade-in"
      onClick={dismissLevelUp}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 text-center shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Sparkles
          className="absolute left-5 top-5 h-6 w-6 animate-bounce text-amber-400"
          aria-hidden="true"
        />
        <Sparkles
          className="absolute bottom-6 right-6 h-5 w-5 animate-pulse text-sapo-400"
          aria-hidden="true"
        />

        <div className="relative mx-auto mb-4 flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-sapo-300/50" />
          <span
            role="img"
            aria-label={`Sapão: ${stage.name}`}
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-sapo-100 text-6xl shadow-lg ring-4 ring-sapo-300"
          >
            {stage.emoji}
          </span>
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">Level Up!</p>
        <h2 className="mt-1 text-4xl font-extrabold text-sapo-900">Nível {levelUp.level}</h2>
        <p className="mt-1 text-slate-600">
          {evolved ? (
            <>
              Seu Sapão evoluiu para <strong>{stage.name}</strong>! 🎉
            </>
          ) : (
            <>
              Seu Sapão segue como <strong>{stage.name}</strong>. Continue se hidratando!
            </>
          )}
        </p>

        <button type="button" onClick={dismissLevelUp} className="btn-primary mt-5 w-full">
          Continuar
        </button>
      </div>
    </div>
  );
}
