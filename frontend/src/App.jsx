import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext'; // FIXED: Import AuthProvider
import AuthForm from './components/Auth/AuthForm';
import UserDashboard from './components/Dashboards/UserDashboard';
import AgentDashboard from './components/Dashboards/AgentDashboard';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import TicketDetail from './components/Tickets/TicketDetail';
import UserManagement from './components/Admin/UserManagement';
import CategoryManagement from './components/Admin/CategoryManagement';

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard', 'ticketDetail', 'adminUsers', 'adminCategories', 'agentTickets'
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const { token, user, loadingAuth, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!loadingAuth && token && user) {
      setCurrentView('dashboard');
    } else if (!loadingAuth && !token) {
      setCurrentView('login');
    }
  }, [loadingAuth, token, user]);

  const handleAuthSuccess = (nextView = 'dashboard') => {
    setCurrentView(nextView);
  };

  const renderDashboard = () => {
    if (!user) return null; // Should not happen if token and user are loaded

    if (currentView === 'ticketDetail') {
      return <TicketDetail ticketId={selectedTicketId} onBackToList={() => setCurrentView('dashboard')} />;
    }

    switch (user.role) {
      case 'End User':
        return <UserDashboard onSelectTicket={(id) => { setSelectedTicketId(id); setCurrentView('ticketDetail'); }} />;
      case 'Support Agent':
        return <AgentDashboard onSelectTicket={(id) => { setSelectedTicketId(id); setCurrentView('ticketDetail'); }} />;
      case 'Admin':
        // Admin dashboard can navigate to specific admin views
        if (currentView === 'adminUsers') {
          return <UserManagement />;
        } else if (currentView === 'adminCategories') {
          return <CategoryManagement />;
        } else if (currentView === 'agentTickets') {
          return <AgentDashboard onSelectTicket={(id) => { setSelectedTicketId(id); setCurrentView('ticketDetail'); }} />;
        }
        return <AdminDashboard setView={setCurrentView} onSelectTicket={(id) => { setSelectedTicketId(id); setCurrentView('ticketDetail'); }} />;
      default:
        return <p className="text-center text-red-600">Unknown user role.</p>;
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Tailwind CSS and Inter font import */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}} />
      <header className="bg-blue-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold">QuickDesk</h1>
        {token && user && (
          <div className="flex items-center space-x-4">
            <span className="text-lg">Welcome, {user.name} ({user.role})</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 transition duration-150 ease-in-out"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="container mx-auto p-6">
        {!token ? (
          currentView === 'login' ? (
            <AuthForm type="login" onAuthSuccess={handleAuthSuccess} />
          ) : (
            <AuthForm type="register" onAuthSuccess={handleAuthSuccess} />
          )
        ) : (
          renderDashboard()
        )}
      </main>
    </div>
  );
}

// Wrap the App component with AuthProvider for context to work
// This should be the default export to ensure App is always within AuthProvider
export default function QuickDeskAppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
