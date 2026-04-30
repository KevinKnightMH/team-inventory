import { useState } from 'react';
import { useData } from '../../context/DataContext';

const DEFAULT_PERMISSIONS = {
  dashboard: { view: false },
  pillars: { view: false, create: false, edit: false, delete: false },
  teams: { view: false, create: false, edit: false, delete: false },
  members: { view: false, create: false, edit: false, delete: false, move: false },
  onboarding: { view: false, create: false, complete: false },
  offboarding: { view: false, create: false, complete: false },
  reports: { view: false, export: false },
  admin: { view: false, manageUsers: false, manageRoles: false }
};

const SCREEN_CONFIG = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    description: 'View system overview and metrics',
    actions: [
      { key: 'view', label: 'View Dashboard' }
    ]
  },
  {
    key: 'pillars',
    label: 'Pillars',
    description: 'Manage organizational pillars',
    actions: [
      { key: 'view', label: 'View' },
      { key: 'create', label: 'Create' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' }
    ]
  },
  {
    key: 'teams',
    label: 'Teams',
    description: 'Manage teams within pillars',
    actions: [
      { key: 'view', label: 'View' },
      { key: 'create', label: 'Create' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' }
    ]
  },
  {
    key: 'members',
    label: 'Team Members',
    description: 'Manage team members',
    actions: [
      { key: 'view', label: 'View' },
      { key: 'create', label: 'Create' },
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete' },
      { key: 'move', label: 'Move Between Teams' }
    ]
  },
  {
    key: 'onboarding',
    label: 'Onboarding',
    description: 'Manage new member onboarding',
    actions: [
      { key: 'view', label: 'View' },
      { key: 'create', label: 'Create' },
      { key: 'complete', label: 'Complete' }
    ]
  },
  {
    key: 'offboarding',
    label: 'Offboarding',
    description: 'Manage member offboarding',
    actions: [
      { key: 'view', label: 'View' },
      { key: 'create', label: 'Initiate' },
      { key: 'complete', label: 'Complete' }
    ]
  },
  {
    key: 'reports',
    label: 'Reports',
    description: 'Access reporting and analytics',
    actions: [
      { key: 'view', label: 'View' },
      { key: 'export', label: 'Export Data' }
    ]
  },
  {
    key: 'admin',
    label: 'Admin',
    description: 'System administration',
    actions: [
      { key: 'view', label: 'Access Admin Screen' },
      { key: 'manageUsers', label: 'Manage Users' },
      { key: 'manageRoles', label: 'Manage Roles' }
    ]
  }
];

export default function RoleForm({ role, onClose }) {
  const { createRole, updateRole } = useData();
  const [formData, setFormData] = useState({
    name: role?.name || '',
    displayName: role?.displayName || '',
    description: role?.description || '',
    permissions: role?.permissions || DEFAULT_PERMISSIONS
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate name from displayName if creating new role
    const roleName = role ? formData.name : formData.displayName.toLowerCase().replace(/\s+/g, '_');

    const roleData = {
      ...formData,
      name: roleName
    };

    if (role) {
      updateRole(role.id, roleData);
    } else {
      createRole(roleData);
    }

    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePermissionChange = (screen, action) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [screen]: {
          ...formData.permissions[screen],
          [action]: !formData.permissions[screen][action]
        }
      }
    });
  };

  const toggleAllScreenPermissions = (screen) => {
    const screenConfig = SCREEN_CONFIG.find(s => s.key === screen);
    const allEnabled = screenConfig.actions.every(
      action => formData.permissions[screen][action.key]
    );

    const newPermissions = {};
    screenConfig.actions.forEach(action => {
      newPermissions[action.key] = !allEnabled;
    });

    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [screen]: newPermissions
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
            Role Display Name *
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., Team Coordinator"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            rows="2"
            placeholder="Brief description of this role's purpose"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which screens and functions this role can access
        </p>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {SCREEN_CONFIG.map(screen => (
            <div key={screen.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{screen.label}</h4>
                    <button
                      type="button"
                      onClick={() => toggleAllScreenPermissions(screen.key)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Toggle All
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{screen.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {screen.actions.map(action => (
                  <label
                    key={action.key}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissions[screen.key]?.[action.key] || false}
                      onChange={() => handlePermissionChange(screen.key, action.key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{action.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {role ? 'Update' : 'Create'} Role
        </button>
      </div>
    </form>
  );
}
