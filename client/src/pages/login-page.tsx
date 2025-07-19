import React, { useState } from 'react';
import { useLocation } from 'wouter';

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Invalid password');
      }

      // On successful login, set sessionStorage so ProtectedRoute lets you in
      sessionStorage.setItem('isAuthenticated', 'true');
      setLocation('/admin/add-project');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="max-w-md w-full p-8 bg-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-neon-green">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-neon-green text-gray-900 font-bold rounded-md hover:bg-green-400 transition-colors duration-300"
          >
            Login
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 rounded-md text-center bg-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
