/**
 * Camada fina sobre o localStorage (nosso "banco de dados" simulado).
 *
 * sapao:users   -> lista global de usuários cadastrados
 * sapao:session -> id do usuário logado no momento
 */
import { normalizeUser } from './user.js';

export const USERS_KEY = 'sapao:users';
export const SESSION_KEY = 'sapao:session';

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeUser) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* armazenamento cheio ou bloqueado: o app segue funcionando em memória */
  }
}

export function loadSession() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function saveSession(id) {
  try {
    localStorage.setItem(SESSION_KEY, id);
  } catch {
    /* ignorado */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignorado */
  }
}
