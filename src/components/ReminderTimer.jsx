import { useState } from 'react';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useNow } from '../hooks/useNow.js';
import Toggle from './Toggle.jsx';
import {
  notificationPermission,
  notificationsSupported,
  requestNotificationPermission,
} from '../utils/notify.js';
import { playReminder } from '../utils/sound.js';

const INTERVALS = [15, 30, 45, 60, 90, 120];

function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function intervalLabel(min) {
  if (min < 60) return `${min} min`;
  const h = min / 60;
  return Number.isInteger(h) ? `${h} h` : `${min} min`;
}

export default function ReminderTimer() {
  const { currentUser: user, setAlertSettings, snoozeAlert } = useApp();
  const now = useNow(1000);
  const [permission, setPermission] = useState(() => notificationPermission());

  const intervalMs = user.alertIntervalMin * 60000;
  const remaining = user.alertsEnabled && user.nextAlertAt ? Math.max(0, user.nextAlertAt - now) : null;
  const elapsedPct =
    remaining === null ? 0 : Math.min(100, Math.max(0, Math.round((1 - remaining / intervalMs) * 100)));

  const options = INTERVALS.includes(user.alertIntervalMin)
    ? INTERVALS
    : [...INTERVALS, user.alertIntervalMin].sort((a, b) => a - b);

  const askPermission = async () => setPermission(await requestNotificationPermission());

  const testAlert = () => {
    if (user.soundEnabled) playReminder();
    snoozeAlert(0);
  };

  return (
    <section className="card" aria-label="Lembretes">
      <div className="flex items-center justify-between">
        <h2 className="card-title">
          {user.alertsEnabled ? (
            <Bell className="h-4 w-4" aria-hidden="true" />
          ) : (
            <BellOff className="h-4 w-4" aria-hidden="true" />
          )}
          Lembretes
        </h2>
        <Toggle
          checked={user.alertsEnabled}
          onChange={(alertsEnabled) => setAlertSettings({ alertsEnabled })}
          label="Ativar lembretes"
        />
      </div>

      <div className="mt-4 text-center">
        {remaining === null ? (
          <p className="py-3 text-slate-500">Lembretes desativados</p>
        ) : (
          <>
            <p className="text-xs uppercase tracking-wide text-slate-500">Próximo lembrete em</p>
            <p
              className="font-mono text-4xl font-bold tabular-nums text-slate-900"
              aria-live="off"
            >
              {remaining === 0 ? 'Agora!' : formatCountdown(remaining)}
            </p>
            <div className="mx-auto mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-sapo-400 transition-all duration-1000 ease-linear"
                style={{ width: `${elapsedPct}%` }}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="interval" className="text-sm text-slate-700">
            Frequência
          </label>
          <select
            id="interval"
            className="input w-auto py-1.5"
            value={user.alertIntervalMin}
            onChange={(e) => setAlertSettings({ alertIntervalMin: Number(e.target.value) })}
          >
            {options.map((min) => (
              <option key={min} value={min}>
                de {intervalLabel(min)} em {intervalLabel(min)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-slate-700">
            {user.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-slate-500" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-500" aria-hidden="true" />
            )}
            Alerta sonoro
          </span>
          <Toggle
            checked={user.soundEnabled}
            onChange={(soundEnabled) => setAlertSettings({ soundEnabled })}
            label="Ativar alerta sonoro"
          />
        </div>

        {notificationsSupported() && permission !== 'granted' && permission !== 'denied' && (
          <button type="button" onClick={askPermission} className="btn-soft w-full">
            Ativar notificações do navegador
          </button>
        )}
        {permission === 'denied' && (
          <p className="text-xs text-slate-500">
            Notificações bloqueadas no navegador. Libere nas configurações do site para receber
            avisos com a aba em segundo plano.
          </p>
        )}

        <button
          type="button"
          onClick={testAlert}
          disabled={!user.alertsEnabled}
          className="btn-ghost w-full text-sapo-700"
        >
          Testar alerta agora
        </button>
      </div>
    </section>
  );
}
