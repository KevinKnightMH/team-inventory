import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Table from '../Common/Table';
import Modal from '../Common/Modal';
import PillarForm from './PillarForm';

export default function PillarList() {
  const { data, deletePillar, getMemberById } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (pillarId) => {
    if (window.confirm('Are you sure you want to delete this pillar?')) {
      const result = deletePillar(pillarId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleEdit = (pillar, e) => {
    e.stopPropagation();
    setEditingPillar(pillar);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPillar(null);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Engineering Lead',
      render: (row) => getMemberById(row.engineeringLead)?.name || 'N/A'
    },
    {
      header: 'Product Lead',
      render: (row) => getMemberById(row.productLead)?.name || 'N/A'
    },
    {
      header: 'Delivery Ops Lead',
      render: (row) => getMemberById(row.deliveryOpsLead)?.name || 'N/A'
    },
    {
      header: 'Teams',
      render: (row) => row.teams.length
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
          <h2 className="text-2xl font-bold text-gray-900">Pillars</h2>
          <p className="text-gray-500 mt-1">Manage organizational pillars</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Pillar
        </button>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={data.pillars}
          onRowClick={(pillar) => navigate(`/pillars/${pillar.id}`)}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingPillar ? 'Edit Pillar' : 'Add New Pillar'}
      >
        <PillarForm pillar={editingPillar} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
