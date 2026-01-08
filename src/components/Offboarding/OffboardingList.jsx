import { useData } from '../../context/DataContext';
import { UserMinus, CheckCircle } from 'lucide-react';
import Table from '../Common/Table';

export default function OffboardingList() {
  const { data, completeOffboarding, getTeamById } = useData();

  const offboardingMembers = data.teamMembers.filter(m => m.status === 'offboarding');

  const handleCompleteOffboarding = (memberId, memberName) => {
    if (window.confirm(`Complete offboarding for ${memberName}? This will remove them from the system and create an open role.`)) {
      completeOffboarding(memberId);
      alert(`${memberName} has been offboarded and removed from the system`);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      render: (row) => <span className="capitalize">{row.role}</span>
    },
    {
      header: 'Team',
      render: (row) => getTeamById(row.teamId)?.name || 'Unassigned'
    },
    { header: 'Location', accessor: 'location' },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleCompleteOffboarding(row.id, row.name)}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Complete Offboarding</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserMinus className="w-7 h-7 text-red-600" />
          Offboarding
        </h2>
        <p className="text-gray-500 mt-1">Manage team members being offboarded</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <UserMinus className="w-5 h-5 text-red-600" />
        <div>
          <p className="font-medium text-red-900">
            {offboardingMembers.length} member{offboardingMembers.length !== 1 ? 's' : ''} currently offboarding
          </p>
          <p className="text-sm text-red-700 mt-0.5">
            Completing offboarding will remove the member and automatically create an open role
          </p>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={offboardingMembers} />
      </div>
    </div>
  );
}
