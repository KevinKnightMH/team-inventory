import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import PillarList from './components/Pillars/PillarList';
import PillarDetail from './components/Pillars/PillarDetail';
import TeamList from './components/Teams/TeamList';
import TeamDetail from './components/Teams/TeamDetail';
import MemberList from './components/Members/MemberList';
import MemberDetail from './components/Members/MemberDetail';
import OnboardingList from './components/Onboarding/OnboardingList';
import OffboardingList from './components/Offboarding/OffboardingList';
import ReportingDashboard from './components/Reports/ReportingDashboard';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pillars" element={<PillarList />} />
        <Route path="pillars/:id" element={<PillarDetail />} />
        <Route path="teams" element={<TeamList />} />
        <Route path="teams/:id" element={<TeamDetail />} />
        <Route path="members" element={<MemberList />} />
        <Route path="members/:id" element={<MemberDetail />} />
        <Route path="onboarding" element={<OnboardingList />} />
        <Route path="offboarding" element={<OffboardingList />} />
        <Route path="reports" element={<ReportingDashboard />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
