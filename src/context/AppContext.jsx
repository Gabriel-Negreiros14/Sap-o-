import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  SESSION_KEY,
  USERS_KEY,
  clearSession,
  loadSession,
  loadUsers,
  saveSession,
  saveUsers,
} from '../utils/storage.js';
import {
  MAX_GOAL,
  MAX_INTERVAL_MIN,
  MAX_SINGLE_INTAKE,
  MIN_GOAL,
  MIN_INTERVAL_MIN,
  createUser,
  rollOverDay,
} from '../utils/user.js';
import { todayKey } from '../utils/date.js';
import { getLevelInfo, xpFromMl } from '../utils/xp.js';

const AppContext = createContext(null);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers());
  const [sessionId, setSessionId] = useState(() => loadSession());
  const [levelUp, setLevelUp] = useState(null);

  const currentUser = useMemo(
    () => users.find((u) => u.id === sessionId) ?? null,
    [users, sessionId],
  );

  /* Persistência: "banco de dados" e sessão no localStorage */
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    if (sessionId) saveSession(sessionId);
    else clearSession();
  }, [sessionId]);

  /* Reset diário: confere a data a cada 30 s, assim a virada da meia-noite
     acontece mesmo com o app aberto. */
  useEffect(() => {
    const tick = () =>
      setUsers((prev) => {
        const next = prev.map(rollOverDay);
        return next.some((u, i) => u !== prev[i]) ? next : prev;
      });
    const id = setInterval(tick, 30000);
    const onVisible = () => {
      if (!document.hidden) tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  /* Sincroniza a lista de usuários entre abas (ex.: admin em uma aba, usuário em outra) */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === USERS_KEY) setUsers(loadUsers());
      if (e.key === SESSION_KEY && !e.newValue) setSessionId(null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* Aplica uma função pura ao usuário logado (já com o reset diário aplicado) */
  const updateCurrent = useCallback(
    (fn) => {
      setUsers((prev) => prev.map((u) => (u.id === sessionId ? fn(rollOverDay(u)) : u)));
    },
    [sessionId],
  );

  /* ---------- Autenticação ---------- */

  const login = useCallback(
    ({ name, nickname, role }) => {
      const cleanName = name.trim();
      const cleanNick = nickname.trim().replace(/^@/, '');
      const existing = users.find((u) => u.nickname.toLowerCase() === cleanNick.toLowerCase());

      if (existing) {
        const updated = { ...rollOverDay(existing), name: cleanName || existing.name, role };
        setUsers((prev) => prev.map((u) => (u.id === existing.id ? updated : u)));
        setSessionId(existing.id);
        return { isNew: false };
      }

      const created = createUser({ name: cleanName, nickname: cleanNick, role });
      setUsers((prev) => [...prev, created]);
      setSessionId(created.id);
      return { isNew: true };
    },
    [users],
  );

  const logout = useCallback(() => {
    setSessionId(null);
    setLevelUp(null);
  }, []);

  /* ---------- Hidratação e XP ---------- */

  const addWater = useCallback(
    (ml) => {
      const amount = Math.round(Number(ml));
      if (!currentUser || !Number.isFinite(amount) || amount <= 0 || amount > MAX_SINGLE_INTAKE) {
        return false;
      }

      const base = rollOverDay(currentUser);
      const gained = xpFromMl(amount);
      const levelBefore = getLevelInfo(base.xp).level;
      const levelAfter = getLevelInfo(base.xp + gained).level;

      const updated = {
        ...base,
        todayMl: base.todayMl + amount,
        xp: base.xp + gained,
        // beber água reinicia o temporizador do próximo lembrete
        nextAlertAt: base.alertsEnabled ? Date.now() + base.alertIntervalMin * 60000 : null,
      };

      setUsers((prev) => prev.map((u) => (u.id === base.id ? updated : u)));
      if (levelAfter > levelBefore) setLevelUp({ level: levelAfter, from: levelBefore });

      return { gained, leveledUp: levelAfter > levelBefore };
    },
    [currentUser],
  );

  const setGoal = useCallback(
    (goal) => {
      const value = Math.round(Number(goal));
      if (!Number.isFinite(value) || value < MIN_GOAL || value > MAX_GOAL) return false;
      updateCurrent((u) => ({ ...u, dailyGoal: value }));
      return true;
    },
    [updateCurrent],
  );

  /* ---------- Lembretes ---------- */

  const setAlertSettings = useCallback(
    (settings) => {
      updateCurrent((u) => {
        const alertsEnabled = settings.alertsEnabled ?? u.alertsEnabled;
        const alertIntervalMin = clamp(
          Math.round(Number(settings.alertIntervalMin ?? u.alertIntervalMin)),
          MIN_INTERVAL_MIN,
          MAX_INTERVAL_MIN,
        );
        const soundEnabled = settings.soundEnabled ?? u.soundEnabled;
        const reschedule =
          settings.alertsEnabled !== undefined || settings.alertIntervalMin !== undefined;

        let nextAlertAt = u.nextAlertAt;
        if (!alertsEnabled) nextAlertAt = null;
        else if (reschedule || !nextAlertAt) nextAlertAt = Date.now() + alertIntervalMin * 60000;

        return { ...u, alertsEnabled, alertIntervalMin, soundEnabled, nextAlertAt };
      });
    },
    [updateCurrent],
  );

  /** Adia o próximo alerta em `minutes` (0 = dispara agora, útil para testar). */
  const snoozeAlert = useCallback(
    (minutes) => {
      updateCurrent((u) =>
        u.alertsEnabled ? { ...u, nextAlertAt: Date.now() + minutes * 60000 } : u,
      );
    },
    [updateCurrent],
  );

  /** Dispensa o alerta atual e agenda o próximo no intervalo configurado. */
  const rescheduleAlert = useCallback(() => {
    updateCurrent((u) =>
      u.alertsEnabled ? { ...u, nextAlertAt: Date.now() + u.alertIntervalMin * 60000 } : u,
    );
  }, [updateCurrent]);

  const dismissLevelUp = useCallback(() => setLevelUp(null), []);

  /* ---------- Admin ---------- */

  const isAdmin = currentUser?.role === 'admin';

  const resetUserProgress = useCallback(
    (id) => {
      if (!isAdmin) return false;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, xp: 0, todayMl: 0, todayDate: todayKey(), history: {} } : u,
        ),
      );
      return true;
    },
    [isAdmin],
  );

  const deleteUser = useCallback(
    (id) => {
      if (!isAdmin || id === sessionId) return false;
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    },
    [isAdmin, sessionId],
  );

  const value = useMemo(
    () => ({
      users,
      currentUser,
      levelUp,
      login,
      logout,
      addWater,
      setGoal,
      setAlertSettings,
      snoozeAlert,
      rescheduleAlert,
      dismissLevelUp,
      resetUserProgress,
      deleteUser,
    }),
    [
      users,
      currentUser,
      levelUp,
      login,
      logout,
      addWater,
      setGoal,
      setAlertSettings,
      snoozeAlert,
      rescheduleAlert,
      dismissLevelUp,
      resetUserProgress,
      deleteUser,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return ctx;
}
