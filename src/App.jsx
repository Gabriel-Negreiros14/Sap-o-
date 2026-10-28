import { useEffect, useState } from 'react';
import { useApp } from './context/AppContext.jsx';
import Login from './components/Login.jsx';
import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import LevelUpModal from './components/LevelUpModal.jsx';
import ReminderAlert from './components/ReminderAlert.jsx';

export default function App() {
  const { currentUser } = useApp();
  const [tab, setTab] = useState('dashboard');
  const isAdmin = currentUser?.role === 'admin';

  // ao sair, a próxima pessoa sempre começa no painel pessoal
  useEffect(() => {
    if (!currentUser) setTab('dashboard');
  }, [currentUser]);

  if (!currentUser) return <Login />;

  // a aba de administração só existe para administradores
  const activeTab = tab === 'admin' && isAdmin ? 'admin' : 'dashboard';

  return (
    <div className="min-h-screen">
      <Header tab={activeTab} onTabChange={setTab} isAdmin={isAdmin} />
      <ReminderAlert />
      <LevelUpModal />

      <main className="mx-auto max-w-5xl px-4 py-5 pb-12">
        {activeTab === 'admin' ? <AdminPanel /> : <Dashboard />}
      </main>
    </div>
  );
}
