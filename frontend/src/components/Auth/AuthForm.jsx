import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const AuthForm = ({ type, onAuthSuccess }) => {
  const { login, register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('End User');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    let result;
    if (type === 'login') {
      result = await login(email, password);
    } else {
      result = await register(name, email, password, role);
    }

    if (result.success) {
      onAuthSuccess();
    } else {
      setMessage(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {type === 'login' ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // For better browser autofill
          />
        </div>
        {type === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="End User">End User</option>
              <option value="Support Agent">Support Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          disabled={loading}
        >
          {loading ? 'Processing...' : (type === 'login' ? 'Login' : 'Register')}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-600 text-sm">{message}</p>}
      <div className="mt-6 text-center">
        {type === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button" // Important for buttons inside forms that shouldn't submit
              onClick={() => onAuthSuccess('register')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button" // Important for buttons inside forms that shouldn't submit
              onClick={() => onAuthSuccess('login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
