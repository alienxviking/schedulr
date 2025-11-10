import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// A simple component for our form inputs
function FormInput({ label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  // --- State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- Hooks ---
  const navigate = useNavigate();
  const { login } = useAuthStore(); // Get the login action from our store

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setError(null);

    try {
      // Remember: Vite proxy forwards this to http://localhost:5000/api/auth/register
      const response = await axios.post('/api/auth/register', {
        email,
        password,
      });

      // 1. Save user info (including token) to our global store
      login(response.data);

      // 2. Redirect to the dashboard
      navigate('/');

    } catch (err) {
      // Handle errors (e.g., "User already exists")
      const message = err.response?.data?.message || 'Failed to register';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* --- Header --- */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Create your Schedulr account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {/* --- Form --- */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <FormInput
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {/* --- Error Message --- */}
          {error && (
            <div className="rounded-md bg-red-900/50 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* --- Submit Button --- */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}