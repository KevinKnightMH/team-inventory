import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function MemberForm({ member, onClose }) {
  const { data, createMember, updateMember } = useData();
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    role: member?.role || 'engineering',
    location: member?.location || '',
    country: member?.country || '',
    teamId: member?.teamId || '',
    reportingManagerId: member?.reportingManagerId || '',
    startDate: member?.startDate || new Date().toISOString().split('T')[0],
    status: member?.status || 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Set pillarId based on teamId
    const team = data.teams.find(t => t.id === formData.teamId);
    const memberData = {
      ...formData,
      pillarId: team?.pillarId || null
    };

    if (member) {
      updateMember(member.id, memberData);
    } else {
      createMember(memberData);
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
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            <option value="engineering">Engineering</option>
            <option value="product">Product</option>
            <option value="design">Design</option>
            <option value="delivery">Delivery</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-2">
          Team
        </label>
        <select
          id="teamId"
          name="teamId"
          value={formData.teamId}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Unassigned</option>
          {data.teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="reportingManagerId" className="block text-sm font-medium text-gray-700 mb-2">
          Reporting Manager
        </label>
        <select
          id="reportingManagerId"
          name="reportingManagerId"
          value={formData.reportingManagerId}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">No Manager</option>
          {data.teamMembers
            .filter(m => m.id !== member?.id && m.status === 'active')
            .map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="onboarding">Onboarding</option>
            <option value="active">Active</option>
            <option value="offboarding">Offboarding</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {member ? 'Update' : 'Create'} Member
        </button>
      </div>
    </form>
  );
}
