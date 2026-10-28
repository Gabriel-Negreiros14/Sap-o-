import { RotateCcw, ShieldCheck, Trash2, Users } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { getLevelInfo } from '../utils/xp.js';
import { ROLE_LABELS } from '../utils/user.js';

export default function AdminPanel() {
  const { users, currentUser, resetUserProgress, deleteUser } = useApp();

  if (currentUser?.role !== 'admin') {
    return (
      <div className="card text-center text-slate-600">
        Acesso restrito a administradores.
      </div>
    );
  }

  const rows = [...users].sort((a, b) => b.xp - a.xp);
  const admins = users.filter((u) => u.role === 'admin').length;
  const avgLevel = rows.length
    ? (rows.reduce((sum, u) => sum + getLevelInfo(u.xp).level, 0) / rows.length).toFixed(1)
    : '0';

  const handleReset = (u) => {
    if (window.confirm(`Resetar o progresso de @${u.nickname}? XP, nível, consumo e histórico voltam a zero.`)) {
      resetUserProgress(u.id);
    }
  };

  const handleDelete = (u) => {
    if (window.confirm(`Excluir o perfil de @${u.nickname}? Esta ação não pode ser desfeita.`)) {
      deleteUser(u.id);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <ShieldCheck className="h-6 w-6 text-sapo-600" aria-hidden="true" />
          Painel do Administrador
        </h1>
        <p className="text-slate-600">Usuários cadastrados neste navegador (localStorage).</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Usuários', value: users.length },
          { label: 'Admins', value: admins },
          { label: 'Nível médio', value: avgLevel },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <section className="card overflow-hidden p-0 sm:p-0" aria-label="Lista de usuários">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Users className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <h2 className="card-title">Todos os usuários</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-semibold">Nome</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Apelido</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Nível</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">XP</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Meta diária</th>
                <th scope="col" className="px-4 py-2.5 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((u) => {
                const isSelf = u.id === currentUser.id;
                return (
                  <tr key={u.id} className={isSelf ? 'bg-sapo-50/50' : undefined}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {u.name}
                      {isSelf && (
                        <span className="ml-2 rounded-full bg-sapo-100 px-2 py-0.5 text-[10px] font-semibold text-sapo-700">
                          você
                        </span>
                      )}
                      <span className="block text-xs font-normal text-slate-500">
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">@{u.nickname}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        Nível {getLevelInfo(u.xp).level}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">
                      {u.xp.toLocaleString('pt-BR')} XP
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">
                      {u.dailyGoal.toLocaleString('pt-BR')} ml
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleReset(u)}
                          className="btn-soft px-3 py-1.5"
                          aria-label={`Resetar progresso de @${u.nickname}`}
                        >
                          <RotateCcw className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden md:inline">Resetar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u)}
                          disabled={isSelf}
                          title={isSelf ? 'Você não pode excluir o próprio perfil logado' : undefined}
                          className="btn-danger px-3 py-1.5"
                          aria-label={`Excluir perfil de @${u.nickname}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden md:inline">Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
