import { useEffect, useRef } from 'react';
import { BellRing } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useNow } from '../hooks/useNow.js';
import { playReminder } from '../utils/sound.js';
import { showNotification } from '../utils/notify.js';

const BASE_TITLE = 'Sapão';

/**
 * Alarme global: fica montado enquanto houver usuário logado (em qualquer aba do app).
 * Quando `nextAlertAt` chega, mostra um banner fixo, toca um som, muda o título da aba
 * e, se permitido, dispara uma notificação do navegador.
 */
export default function ReminderAlert() {
  const { currentUser, addWater, snoozeAlert, rescheduleAlert } = useApp();
  const now = useNow(1000);

  const nextAlertAt = currentUser?.nextAlertAt ?? null;
  const soundEnabled = currentUser?.soundEnabled ?? false;
  const due = Boolean(currentUser?.alertsEnabled && nextAlertAt && now >= nextAlertAt);

  const firedFor = useRef(null);

  useEffect(() => {
    if (!due) return undefined;

    document.title = '💧 Hora de beber água!';
    if (firedFor.current !== nextAlertAt) {
      firedFor.current = nextAlertAt;
      if (soundEnabled) playReminder();
      if (document.hidden) {
        showNotification('Hora de beber água 💧', 'Toque para registrar o seu copo.');
      }
    }
    return () => {
      document.title = BASE_TITLE;
    };
  }, [due, nextAlertAt, soundEnabled]);

  if (!due) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-40 p-3 animate-slide-down" role="alert">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-3 text-white shadow-xl">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20">
          <BellRing className="h-6 w-6 animate-pulse" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight">Hora de beber água! 💧</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addWater(200)}
              className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              +200 ml
            </button>
            <button
              type="button"
              onClick={() => snoozeAlert(5)}
              className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium transition hover:bg-white/30"
            >
              Adiar 5 min
            </button>
            <button
              type="button"
              onClick={rescheduleAlert}
              className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium transition hover:bg-white/30"
            >
              Dispensar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
