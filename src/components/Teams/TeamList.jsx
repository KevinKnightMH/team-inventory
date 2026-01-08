import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Table from '../Common/Table';
import Modal from '../Common/Modal';
import TeamForm from './TeamForm';

export default function TeamList() {
  const { data, deleteTeam, getPillarById, getMemberById } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      const result = deleteTeam(teamId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleEdit = (team, e) => {
    e.stopPropagation();
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTeam(null);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Pillar',
      render: (row) => getPillarById(row.pillarId)?.name || 'N/A'
    },
    {
      header: 'Engineering Manager',
      render: (row) => getMemberById(row.engineeringManager)?.name || 'N/A'
    },
    {
      header: 'Product Manager',
      render: (row) => getMemberById(row.productManager)?.name || 'N/A'
    },
    {
      header: 'Members',
      render: (row) => row.members.length
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
          <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
          <p className="text-gray-500 mt-1">Manage organizational teams</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Team
        </button>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={data.teams}
          onRowClick={(team) => navigate(`/teams/${team.id}`)}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTeam ? 'Edit Team' : 'Add New Team'}
      >
        <TeamForm team={editingTeam} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
