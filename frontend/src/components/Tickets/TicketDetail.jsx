import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const TicketDetail = ({ ticketId, onBackToList }) => {
  const { token, user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [agents, setAgents] = useState([]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.getTicketById(ticketId, token);
      setTicket(data);
      setSelectedStatus(data.status);
      setAssigneeId(data.assignee_id || '');
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      setMessage('Failed to load ticket details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    if (user.role === 'Admin' || user.role === 'Support Agent') {
      try {
        const allUsers = await api.getAllUsers(token);
        if (Array.isArray(allUsers)) {
          setAgents(allUsers.filter(u => u.role === 'Support Agent'));
        } else {
          console.error('API did not return an array for allUsers:', allUsers);
          setAgents([]);
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    fetchAgents();
  }, [ticketId, token, user.role]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.addComment(ticketId, newComment, token);
      setMessage('Comment added successfully!');
      setNewComment('');
      fetchTicketDetails(); // Refresh comments
    } catch (error) {
      console.error('Add comment error:', error);
      setMessage('Failed to add comment.');
    }
  };

  const handleUpdateStatus = async () => {
    setMessage('');
    try {
      await api.updateTicketStatus(ticketId, selectedStatus, token);
      setMessage('Status updated successfully!');
      fetchTicketDetails();
    } catch (error) {
      console.error('Update status error:', error);
      setMessage('Failed to update status.');
    }
  };

  const handleAssignTicket = async () => {
    setMessage('');
    try {
      await api.assignTicket(ticketId, assigneeId, token);
      setMessage('Ticket assigned successfully!');
      fetchTicketDetails();
    } catch (error) {
      console.error('Assign ticket error:', error);
      setMessage('Failed to assign ticket.');
    }
  };

  // New function to handle "Assign to Me"
  const handleAssignToMe = async () => {
    setMessage('');
    try {
      await api.assignTicket(ticketId, user.id, token); // Assign to current user's ID
      setMessage('Ticket assigned to you successfully!');
      fetchTicketDetails(); // Refresh ticket details to show new assignee
    } catch (error) {
      console.error('Assign to me error:', error);
      setMessage('Failed to assign ticket to yourself.');
    }
  };

  const handleVote = async (voteType) => {
    setMessage('');
    try {
      await api.voteTicket(ticketId, voteType, token);
      setMessage(`Ticket ${voteType}d!`);
      fetchTicketDetails(); // Refresh votes
    } catch (error) {
      console.error('Vote error:', error);
      setMessage('Failed to record vote.');
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading ticket details...</p>;
  if (!ticket) return <p className="text-center text-red-600">Ticket not found or access denied.</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <button
        onClick={onBackToList}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
      >
        &larr; Back to List
      </button>
      <h3 className="text-3xl font-bold text-gray-800 mb-4">{ticket.subject}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <p className="text-gray-700"><strong>Status:</strong> <span className={`font-semibold ${ticket.status === 'Open' ? 'text-red-500' : ticket.status === 'In Progress' ? 'text-blue-500' : 'text-green-500'}`}>{ticket.status}</span></p>
        <p className="text-gray-700"><strong>Category:</strong> {ticket.category_name || 'N/A'}</p>
        <p className="text-gray-700"><strong>Reported By:</strong> {ticket.reporter_name}</p>
        <p className="text-gray-700"><strong>Assigned To:</strong> {ticket.assignee_name || 'Unassigned'}</p>
        <p className="text-gray-700"><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
        <p className="text-gray-700"><strong>Last Updated:</strong> {new Date(ticket.updated_at).toLocaleString()}</p>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-md">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Description</h4>
        <p className="text-gray-700">{ticket.description}</p>
        {ticket.attachment_url && (
          <div className="mt-4">
            <a href={ticket.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Attachment
            </a>
          </div>
        )}
      </div>

      {(user.role === 'Support Agent' || user.role === 'Admin') && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md shadow-inner">
          <h4 className="text-xl font-semibold text-blue-800 mb-3">Agent/Admin Actions</h4>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700">Update Status:</label>
              <select
                className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                onClick={handleUpdateStatus}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Status
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700">Assign To:</label>
              {/* <select
                className="mt-1 block w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select> */}
              {/* <button
                onClick={handleAssignTicket}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm Assignment
              </button> */}
              {/* NEW: Assign to Me button */}
              <button
                onClick={handleAssignToMe}
                className="mt-2 ml-2 px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Assign to Me
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-3">Comments ({ticket.comments?.length || 0})</h4>
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {ticket.comments && ticket.comments.length > 0 ? (
            ticket.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-3 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-900">
                  {comment.user_id === user.id ? 'You' : `User ${comment.user_id}`} at {new Date(comment.created_at).toLocaleString()}
                </p>
                <p className="text-gray-700 text-sm mt-1">{comment.comment_text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No comments yet.</p>
          )}
        </div>
        <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
          <textarea
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows="2"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 self-end"
          >
            Post
          </button>
        </form>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => handleVote('upvote')}
          className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Upvote ({ticket.upvotes})
        </button>
        <button
          onClick={() => handleVote('downvote')}
          className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Downvote ({ticket.downvotes})
        </button>
      </div>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default TicketDetail;
