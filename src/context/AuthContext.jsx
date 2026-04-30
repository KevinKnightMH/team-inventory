import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@company.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'engmgr@company.com',
    password: 'eng123',
    name: 'Engineering Manager',
    role: 'engineering_manager'
  },
  {
    id: '3',
    email: 'pm@company.com',
    password: 'pm123',
    name: 'Product Manager',
    role: 'product_manager'
  },
  {
    id: '4',
    email: 'delivery@company.com',
    password: 'del123',
    name: 'Delivery Lead',
    role: 'delivery_lead'
  }
];

// Default role for new Google OAuth users
const DEFAULT_OAUTH_ROLE = 'viewer';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('auth-user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const matchedUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (matchedUser) {
      const { password: _, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('auth-user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const loginWithGoogle = (credentialResponse) => {
    try {
      // Decode JWT token from Google
      const token = credentialResponse.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);

      // Create user object from Google profile
      const googleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: DEFAULT_OAUTH_ROLE,
        authProvider: 'google'
      };

      setUser(googleUser);
      localStorage.setItem('auth-user', JSON.stringify(googleUser));
      return { success: true, user: googleUser };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Failed to authenticate with Google' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
