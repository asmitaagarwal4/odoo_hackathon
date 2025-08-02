import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import TicketForm from '../Tickets/TicketForm';
import TicketList from '../Tickets/TicketList';

const UserDashboard = ({ onSelectTicket }) => {
  const { token } = useContext(AuthContext);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchMyTickets = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.getMyTickets(token);
      setMyTickets(data);
    } catch (error) {
      console.error('Failed to fetch my tickets:', error);
      setMessage('Failed to load your tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [token]);

  return (
    <div className="space-y-8">
      <TicketForm onTicketCreated={fetchMyTickets} />
      <TicketList tickets={myTickets} title="My Submitted Tickets" onSelectTicket={onSelectTicket} onRefresh={fetchMyTickets} />
      {message && <p className="text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default UserDashboard;
