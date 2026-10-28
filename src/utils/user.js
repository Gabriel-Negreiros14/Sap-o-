import { todayKey } from './date.js';

export const DEFAULT_GOAL = 2000;
export const MIN_GOAL = 500;
export const MAX_GOAL = 10000;
export const DEFAULT_INTERVAL_MIN = 30;
export const MIN_INTERVAL_MIN = 5;
export const MAX_INTERVAL_MIN = 240;
export const MAX_SINGLE_INTAKE = 5000;

const HISTORY_LIMIT = 90;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const makeId = () => `u_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function pruneHistory(history) {
  const keys = Object.keys(history).sort();
  if (keys.length <= HISTORY_LIMIT) return history;
  const keep = new Set(keys.slice(-HISTORY_LIMIT));
  return Object.fromEntries(Object.entries(history).filter(([key]) => keep.has(key)));
}

/**
 * Reset diário: se a data salva no usuário não é a de hoje (relógio do navegador),
 * o consumo do dia anterior vai para o histórico e `todayMl` volta a zero.
 * XP, nível e histórico são preservados. Retorna o mesmo objeto se nada mudou.
 */
export function rollOverDay(user) {
  const today = todayKey();
  if (user.todayDate === today) return user;

  let history = user.history;
  if (user.todayMl > 0) {
    history = { ...history, [user.todayDate]: { ml: user.todayMl, goal: user.dailyGoal } };
  }

  return { ...user, history: pruneHistory(history), todayMl: 0, todayDate: today };
}

/** Garante que qualquer objeto vindo do localStorage tenha todos os campos válidos. */
export function normalizeUser(raw = {}) {
  const intervalRaw = Number(raw.alertIntervalMin);
  const alertIntervalMin = clamp(
    Number.isFinite(intervalRaw) && intervalRaw > 0 ? Math.round(intervalRaw) : DEFAULT_INTERVAL_MIN,
    MIN_INTERVAL_MIN,
    MAX_INTERVAL_MIN,
  );
  const alertsEnabled = raw.alertsEnabled !== false;
  const hasHistory = raw.history && typeof raw.history === 'object' && !Array.isArray(raw.history);

  return rollOverDay({
    id: raw.id ?? makeId(),
    name: String(raw.name ?? '').trim() || 'Sem nome',
    nickname: String(raw.nickname ?? '').trim() || 'anonimo',
    role: raw.role === 'admin' ? 'admin' : 'user',
    dailyGoal: clamp(Math.round(Number(raw.dailyGoal) || DEFAULT_GOAL), MIN_GOAL, MAX_GOAL),
    xp: Math.max(0, Math.floor(Number(raw.xp) || 0)),
    todayMl: Math.max(0, Math.round(Number(raw.todayMl) || 0)),
    todayDate: typeof raw.todayDate === 'string' ? raw.todayDate : todayKey(),
    history: hasHistory ? raw.history : {},
    alertsEnabled,
    alertIntervalMin,
    soundEnabled: raw.soundEnabled !== false,
    nextAlertAt: alertsEnabled
      ? Number(raw.nextAlertAt) || Date.now() + alertIntervalMin * 60000
      : null,
    createdAt: Number(raw.createdAt) || Date.now(),
  });
}

export function createUser({ name, nickname, role }) {
  return normalizeUser({ id: makeId(), name, nickname, role, createdAt: Date.now() });
}

export const ROLE_LABELS = {
  user: 'Usuário Comum',
  admin: 'Administrador',
};
