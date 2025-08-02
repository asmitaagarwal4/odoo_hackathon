import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import TicketList from '../Tickets/TicketList';

const AgentDashboard = ({ onSelectTicket }) => {
  const { token } = useContext(AuthContext);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAllTickets = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.getAllTickets(token);
      setAllTickets(data);
    } catch (error) {
      console.error('Failed to fetch all tickets:', error);
      setMessage('Failed to load all tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, [token]);

  return (
    <div className="space-y-8">
      <TicketList tickets={allTickets} title="All Tickets" onSelectTicket={onSelectTicket} onRefresh={fetchAllTickets} />
      {message && <p className="text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default AgentDashboard;
