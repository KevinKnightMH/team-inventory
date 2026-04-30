import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2, Shield, Lock } from 'lucide-react';
import Modal from '../Common/Modal';
import RoleForm from './RoleForm';
import Table from '../Common/Table';

export default function RoleManagement() {
  const { data, deleteRole } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const handleEdit = (role) => {
    if (role.isSystem) {
      alert('System roles cannot be edited');
      return;
    }
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleDelete = (role) => {
    if (role.isSystem) {
      alert('System roles cannot be deleted');
      return;
    }

    if (window.confirm(`Are you sure you want to delete the role "${role.displayName}"?`)) {
      const result = deleteRole(role.id);
      if (!result.success) {
        setDeleteError(result.error);
        setTimeout(() => setDeleteError(''), 5000);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRole(null);
  };

  const columns = [
    {
      header: 'Role Name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">{row.displayName}</p>
            <p className="text-xs text-gray-500">{row.name}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <p className="text-sm text-gray-600">{row.description}</p>
      )
    },
    {
      header: 'Type',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.isSystem && (
            <>
              <Lock className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-500">System Role</span>
            </>
          )}
          {!row.isSystem && (
            <span className="text-xs text-green-600">Custom Role</span>
          )}
        </div>
      )
    },
    {
      header: 'Screens',
      render: (row) => {
        const screenCount = Object.keys(row.permissions || {}).length;
        const accessibleScreens = Object.entries(row.permissions || {})
          .filter(([_, perms]) => perms.view)
          .length;
        return (
          <span className="text-sm text-gray-600">
            {accessibleScreens} of {screenCount}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className={`text-blue-600 hover:text-blue-800 ${row.isSystem ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={row.isSystem}
            title={row.isSystem ? 'System roles cannot be edited' : 'Edit role'}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className={`text-red-600 hover:text-red-800 ${row.isSystem ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={row.isSystem}
            title={row.isSystem ? 'System roles cannot be deleted' : 'Delete role'}
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
          <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
          <p className="text-gray-500 mt-1">Create and manage custom roles with specific permissions</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {deleteError}
        </div>
      )}

      <div className="card">
        <Table columns={columns} data={data.roles || []} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">About Roles & Permissions</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>System Roles</strong> are built-in and cannot be modified or deleted</li>
          <li>• <strong>Custom Roles</strong> can be created with specific screen and function access</li>
          <li>• Each role can have different permissions for viewing, creating, editing, and deleting data</li>
          <li>• Users assigned to a role will inherit all permissions from that role</li>
        </ul>
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingRole ? 'Edit Role' : 'Create New Role'}
      >
        <RoleForm role={editingRole} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
