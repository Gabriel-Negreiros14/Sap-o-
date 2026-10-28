import { Droplet } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import WaterProgress from './WaterProgress.jsx';
import QuickAdd from './QuickAdd.jsx';
import GoalSettings from './GoalSettings.jsx';
import XPBar from './XPBar.jsx';
import ReminderTimer from './ReminderTimer.jsx';
import History from './History.jsx';

export default function Dashboard() {
  const { currentUser: user } = useApp();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Olá, {user.name.split(' ')[0]}! 👋</h1>
        <p className="text-slate-600">Vamos manter a hidratação em dia hoje.</p>
      </div>

      {/* Mobile: uma coluna na ordem do DOM. Desktop: grade de 3 colunas posicionada explicitamente. */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section
          className="card space-y-4 lg:col-span-2 lg:col-start-1 lg:row-start-1"
          aria-label="Consumo de hoje"
        >
          <h2 className="card-title">
            <Droplet className="h-4 w-4" aria-hidden="true" />
            Hoje
          </h2>
          <GoalSettings goal={user.dailyGoal} />
          <WaterProgress current={user.todayMl} goal={user.dailyGoal} />
          <QuickAdd />
        </section>

        <div className="lg:col-start-3 lg:row-start-1">
          <XPBar xp={user.xp} />
        </div>

        <div className="lg:col-start-3 lg:row-start-2">
          <ReminderTimer />
        </div>

        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2">
          <History user={user} />
        </div>
      </div>
    </div>
  );
}
