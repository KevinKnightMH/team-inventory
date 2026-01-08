import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UserPlus, CheckCircle, Plus } from 'lucide-react';
import Table from '../Common/Table';
import Modal from '../Common/Modal';
import OnboardingForm from './OnboardingForm';

export default function OnboardingList() {
  const { data, completeOnboarding, getTeamById } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const onboardingMembers = data.teamMembers.filter(m => m.status === 'onboarding');

  const handleCompleteOnboarding = (memberId, memberName) => {
    if (window.confirm(`Mark ${memberName} as fully onboarded?`)) {
      completeOnboarding(memberId);
      alert(`${memberName} is now active!`);
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
    { header: 'Start Date', accessor: 'startDate' },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleCompleteOnboarding(row.id, row.name)}
          className="flex items-center gap-2 text-green-600 hover:text-green-800"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Complete Onboarding</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="w-7 h-7 text-orange-600" />
            Onboarding
          </h2>
          <p className="text-gray-500 mt-1">Manage new team members being onboarded</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Member
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
        <UserPlus className="w-5 h-5 text-orange-600" />
        <div>
          <p className="font-medium text-orange-900">
            {onboardingMembers.length} member{onboardingMembers.length !== 1 ? 's' : ''} currently onboarding
          </p>
          <p className="text-sm text-orange-700 mt-0.5">
            Click "Complete Onboarding" when a member is ready to be marked as active
          </p>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={onboardingMembers} />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add New Team Member"
      >
        <OnboardingForm onClose={() => setIsFormOpen(false)} />
      </Modal>
    </div>
  );
}
