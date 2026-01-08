import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  Users,
  UserPlus,
  UserMinus,
  Briefcase as BriefcaseIcon,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

function StatCard({ title, value, icon: Icon, color, link }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  const Card = (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return link ? <Link to={link}>{Card}</Link> : Card;
}

export default function Dashboard() {
  const { data, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const stats = {
    pillars: data.pillars.length,
    teams: data.teams.length,
    members: data.teamMembers.filter(m => m.status === 'active').length,
    onboarding: data.teamMembers.filter(m => m.status === 'onboarding').length,
    offboarding: data.teamMembers.filter(m => m.status === 'offboarding').length,
    openRoles: data.openRoles.filter(r => r.status === 'open').length
  };

  const recentActivity = [
    ...data.teamMembers
      .filter(m => m.status === 'onboarding')
      .map(m => ({
        type: 'onboarding',
        message: `${m.name} is being onboarded`,
        date: m.startDate
      })),
    ...data.teamMembers
      .filter(m => m.status === 'offboarding')
      .map(m => ({
        type: 'offboarding',
        message: `${m.name} is being offboarded`,
        date: new Date().toISOString().split('T')[0]
      }))
  ].slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of your organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Pillars"
          value={stats.pillars}
          icon={Building2}
          color="blue"
          link="/pillars"
        />
        <StatCard
          title="Total Teams"
          value={stats.teams}
          icon={Briefcase}
          color="purple"
          link="/teams"
        />
        <StatCard
          title="Active Members"
          value={stats.members}
          icon={Users}
          color="green"
          link="/members"
        />
        <StatCard
          title="Onboarding"
          value={stats.onboarding}
          icon={UserPlus}
          color="orange"
          link="/onboarding"
        />
        <StatCard
          title="Offboarding"
          value={stats.offboarding}
          icon={UserMinus}
          color="red"
          link="/offboarding"
        />
        <StatCard
          title="Open Roles"
          value={stats.openRoles}
          icon={BriefcaseIcon}
          color="yellow"
          link="/reports"
        />
      </div>

      {recentActivity.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {activity.type === 'onboarding' ? (
                  <UserPlus className="w-5 h-5 text-orange-500 flex-shrink-0" />
                ) : (
                  <UserMinus className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.openRoles > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-900">Open Positions</h4>
            <p className="text-sm text-yellow-700 mt-1">
              There are {stats.openRoles} open position{stats.openRoles !== 1 ? 's' : ''} that need
              to be filled.{' '}
              <Link to="/reports" className="font-medium text-yellow-900 hover:underline">
                View Open Positions →
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
