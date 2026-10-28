import { useState } from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const ROLES = [
  {
    value: 'user',
    label: 'Usuário Comum',
    desc: 'Registre sua água e suba de nível',
    Icon: User,
  },
  {
    value: 'admin',
    label: 'Administrador',
    desc: 'Gerencie os usuários cadastrados',
    Icon: ShieldCheck,
  },
];

const NICK_PATTERN = /^[a-zA-Z0-9_.-]{3,20}$/;

export default function Login() {
  const { login, users } = useApp();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanNick = nickname.trim().replace(/^@/, '');

    if (cleanName.length < 2) return setError('Informe seu nome (mínimo 2 letras).');
    if (!NICK_PATTERN.test(cleanNick)) {
      return setError('O apelido deve ter de 3 a 20 caracteres: letras, números, ponto, hífen ou _.');
    }

    setError('');
    return login({ name: cleanName, nickname: cleanNick, role });
  };

  const pickExisting = (u) => {
    setName(u.name);
    setNickname(u.nickname);
    setRole(u.role);
    setError('');
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-sapo-100 shadow-lg ring-2 ring-sapo-300">
          <span className="text-4xl leading-none animate-hop" aria-hidden="true">🐸</span>
        </div>
        <h1 className="text-3xl font-bold text-sapo-900">Sapão</h1>
        <p className="mt-1 text-slate-600">Beba água, evolua seu sapo e suba de nível.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Maria Silva"
            autoComplete="name"
            maxLength={60}
          />
        </div>

        <div>
          <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-slate-700">
            Apelido (Nickname)
          </label>
          <input
            id="nickname"
            className="input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ex.: maria_hidrata"
            autoComplete="username"
            autoCapitalize="none"
            maxLength={21}
          />
          <p className="mt-1 text-xs text-slate-500">
            Se o apelido já existir, você entra na conta existente.
          </p>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Tipo de perfil</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLES.map(({ value, label, desc, Icon }) => {
              const selected = role === value;
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    selected
                      ? 'border-sapo-500 bg-sapo-50 ring-2 ring-sapo-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={selected}
                    onChange={() => setRole(value)}
                    className="sr-only"
                  />
                  <Icon
                    className={`mt-0.5 h-5 w-5 shrink-0 ${selected ? 'text-sapo-600' : 'text-slate-400'}`}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{label}</span>
                    <span className="block text-xs text-slate-500">{desc}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full py-3 text-base">
          Entrar / Cadastrar
        </button>
      </form>

      {users.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
            Contas neste navegador
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {users.slice(0, 8).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => pickExisting(u)}
                className="rounded-full bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-sapo-50 hover:ring-sapo-300"
              >
                @{u.nickname}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
