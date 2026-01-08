import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function OnboardingForm({ onClose }) {
  const { data, createMember } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'engineering',
    location: '',
    teamId: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const team = data.teams.find(t => t.id === formData.teamId);
    const memberData = {
      ...formData,
      pillarId: team?.pillarId || null,
      status: 'onboarding'
    };

    createMember(memberData);
    alert(`${formData.name} has been added to the onboarding queue`);
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

      <div>
        <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-2">
          Assign to Team
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

      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Add to Onboarding
        </button>
      </div>
    </form>
  );
}
