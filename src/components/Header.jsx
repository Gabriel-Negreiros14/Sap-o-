import { LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { ROLE_LABELS } from '../utils/user.js';

export default function Header({ tab, onTabChange, isAdmin }) {
  const { currentUser, logout } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Meu painel', Icon: LayoutDashboard },
    ...(isAdmin ? [{ id: 'admin', label: 'Administração', Icon: Users }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sapo-100 ring-1 ring-sapo-200">
            <span className="text-xl leading-none" aria-hidden="true">🐸</span>
          </span>
          <span className="text-lg font-bold text-sapo-900">Sapão</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right leading-tight">
            <p className="max-w-[8rem] truncate text-sm font-semibold text-slate-800 sm:max-w-none">
              @{currentUser.nickname}
            </p>
            <p className="flex items-center justify-end gap-1 text-xs text-slate-500">
              {isAdmin && <ShieldCheck className="h-3 w-3 text-sapo-600" aria-hidden="true" />}
              {ROLE_LABELS[currentUser.role]}
            </p>
          </div>
          <button type="button" onClick={logout} className="btn-ghost px-3" aria-label="Sair da conta">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {tabs.length > 1 && (
        <nav className="mx-auto flex max-w-5xl gap-1 px-4" aria-label="Seções">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={tab === id ? 'page' : undefined}
              className={`flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition ${
                tab === id
                  ? 'border-sapo-500 text-sapo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
