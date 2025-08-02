import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = ({ setView, onSelectTicket }) => {
  const { token } = useContext(AuthContext); // Token might be used for conditional rendering or passing to sub-components

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setView('adminUsers')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Manage Users
        </button>
        <button
          onClick={() => setView('adminCategories')}
          className="px-6 py-3 bg-purple-600 text-white rounded-md shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
        >
          Manage Categories
        </button>
        <button
          onClick={() => setView('agentTickets')} // Admins can also view all tickets
          className="px-6 py-3 bg-teal-600 text-white rounded-md shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
        >
          View All Tickets
        </button>
      </div>
      {/* Render specific admin sub-views if needed, or link to them */}
    </div>
  );
};

export default AdminDashboard;
