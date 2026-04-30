import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const quickLogin = (email, password) => {
    setEmail(email);
    setPassword(password);
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    setError('');
    const result = loginWithGoogle(credentialResponse);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Team Inventory</h1>
          <p className="text-gray-500 mt-2">Organization Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="email@company.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3 text-center">Quick login (demo accounts):</p>
          <div className="space-y-2">
            <button
              onClick={() => quickLogin('admin@company.com', 'admin123')}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
            >
              <span className="font-medium">Admin</span> - admin@company.com
            </button>
            <button
              onClick={() => quickLogin('engmgr@company.com', 'eng123')}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
            >
              <span className="font-medium">Eng Manager</span> - engmgr@company.com
            </button>
            <button
              onClick={() => quickLogin('pm@company.com', 'pm123')}
              className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
            >
              <span className="font-medium">Product Manager</span> - pm@company.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
