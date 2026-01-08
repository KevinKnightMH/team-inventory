import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Table from '../Common/Table';
import Modal from '../Common/Modal';
import MemberForm from './MemberForm';
import SearchFilter from '../Common/SearchFilter';

export default function MemberList() {
  const { data, deleteMember, getTeamById, getPillarById } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    team: '',
    pillar: '',
    role: '',
    status: 'active'
  });
  const navigate = useNavigate();

  const handleDelete = (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMember(memberId);
    }
  };

  const handleEdit = (member, e) => {
    e.stopPropagation();
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMember(null);
  };

  // Filter members
  const filteredMembers = data.teamMembers.filter(member => {
    if (filters.search && !member.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !member.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.team && member.teamId !== filters.team) return false;
    if (filters.pillar && member.pillarId !== filters.pillar) return false;
    if (filters.role && member.role !== filters.role) return false;
    if (filters.status && member.status !== filters.status) return false;
    return true;
  });

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
      header: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active' ? 'bg-green-100 text-green-800' :
          row.status === 'onboarding' ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => handleEdit(row, e)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Members</h2>
          <p className="text-gray-500 mt-1">Manage team members</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="card">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field pl-10"
            />
          </div>

          <select
            value={filters.pillar}
            onChange={(e) => setFilters({ ...filters, pillar: e.target.value })}
            className="input-field"
          >
            <option value="">All Pillars</option>
            {data.pillars.map(pillar => (
              <option key={pillar.id} value={pillar.id}>{pillar.name}</option>
            ))}
          </select>

          <select
            value={filters.team}
            onChange={(e) => setFilters({ ...filters, team: e.target.value })}
            className="input-field"
          >
            <option value="">All Teams</option>
            {data.teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="input-field"
          >
            <option value="">All Roles</option>
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
            <option value="delivery">Delivery</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="onboarding">Onboarding</option>
            <option value="offboarding">Offboarding</option>
          </select>
        </div>

        <Table
          columns={columns}
          data={filteredMembers}
          onRowClick={(member) => navigate(`/members/${member.id}`)}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingMember ? 'Edit Member' : 'Add New Member'}
      >
        <MemberForm member={editingMember} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
