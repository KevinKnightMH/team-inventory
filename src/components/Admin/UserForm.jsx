import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function UserForm({ user, onClose }) {
  const { data, createUser, updateUser } = useData();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: user?.password || '',
    role: user?.role || (data.roles && data.roles.length > 0 ? data.roles[0].name : 'admin')
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user) {
      updateUser(user.id, formData);
    } else {
      createUser(formData);
    }

    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required={!user}
          placeholder={user ? "Leave blank to keep current password" : ""}
        />
        {user && (
          <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-field"
          required
        >
          {(data.roles || []).map(role => (
            <option key={role.id} value={role.name}>
              {role.displayName}
            </option>
          ))}
        </select>
        {formData.role && (
          <p className="text-xs text-gray-500 mt-1">
            {data.roles?.find(r => r.name === formData.role)?.description}
          </p>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {user ? 'Update' : 'Create'} User
        </button>
      </div>
    </form>
  );
}
