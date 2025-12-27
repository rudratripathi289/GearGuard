import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Loading from '../components/common/Loading';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('employee');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, userType);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Equipment Tracker</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Login As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('employee')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                  userType === 'employee'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">👤</div>
                <div className="text-sm font-semibold">Employee</div>
                <div className="text-xs text-gray-600 mt-1">Send Requests Only</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('maintenance')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                  userType === 'maintenance'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="text-lg mb-1">🔧</div>
                <div className="text-sm font-semibold">Maintenance Team</div>
                <div className="text-xs text-gray-600 mt-1">Manage All Requests</div>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {userType === 'employee'
                ? 'You will only see your own equipment and requests. You cannot change request status.'
                : 'You will see all requests and can manage the entire workflow.'}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">Demo Credentials:</p>
            {userType === 'employee' ? (
              <>
                <p>Employee: sarah@example.com</p>
                <p>Employee: mike@example.com</p>
              </>
            ) : (
              <>
                <p>Admin: admin@example.com</p>
                <p>Technician: john@example.com</p>
                <p>Technician: jane@example.com</p>
              </>
            )}
            <p className="mt-1 text-xs">(Password can be anything)</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

