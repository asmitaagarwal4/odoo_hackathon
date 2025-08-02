import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const UserManagement = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await api.getAllUsers(token);
      if (Array.isArray(data)) { // Ensure data is an array
        setUsers(data);
      } else {
        console.error('API did not return an array for users:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setMessage('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    setMessage('');
    try {
      await api.updateUserRole(userId, newRole, token);
      setMessage('User role updated!');
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Update role error:', error);
      setMessage('Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete their tickets and comments.')) {
      setMessage('');
      try {
        await api.deleteUser(userId, token);
        setMessage('User deleted successfully!');
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error('Delete user error:', error);
        setMessage('Failed to delete user.');
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading users...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((userItem) => (
              <tr key={userItem.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{userItem.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <select
                    value={userItem.role}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                    className="block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="End User">End User</option>
                    <option value="Support Agent">Support Agent</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(userItem.id)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default UserManagement;
