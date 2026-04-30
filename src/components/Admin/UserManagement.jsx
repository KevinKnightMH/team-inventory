import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Table from '../Common/Table';
import Modal from '../Common/Modal';
import UserForm from './UserForm';

export default function UserManagement() {
  const { data, deleteUser, createUser, updateUser } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handleEdit = (user, e) => {
    e.stopPropagation();
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Role',
      render: (row) => {
        const roleData = data.roles?.find(r => r.name === row.role);
        return (
          <span className="capitalize px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {roleData?.displayName || row.role.replace('_', ' ')}
          </span>
        );
      }
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
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-1">Manage system users and access</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={data.users || []}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm user={editingUser} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
