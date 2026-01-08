import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function TeamForm({ team, onClose }) {
  const { data, createTeam, updateTeam } = useData();
  const [formData, setFormData] = useState({
    name: team?.name || '',
    pillarId: team?.pillarId || '',
    engineeringManager: team?.engineeringManager || '',
    productManager: team?.productManager || '',
    deliveryLead: team?.deliveryLead || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (team) {
      updateTeam(team.id, formData);
    } else {
      createTeam(formData);
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
          Team Name
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
        <label htmlFor="pillarId" className="block text-sm font-medium text-gray-700 mb-2">
          Pillar
        </label>
        <select
          id="pillarId"
          name="pillarId"
          value={formData.pillarId}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select Pillar</option>
          {data.pillars.map(pillar => (
            <option key={pillar.id} value={pillar.id}>
              {pillar.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="engineeringManager" className="block text-sm font-medium text-gray-700 mb-2">
          Engineering Manager
        </label>
        <select
          id="engineeringManager"
          name="engineeringManager"
          value={formData.engineeringManager}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Engineering Manager</option>
          {data.teamMembers
            .filter(m => m.role === 'engineering' && m.status === 'active')
            .map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="productManager" className="block text-sm font-medium text-gray-700 mb-2">
          Product Manager
        </label>
        <select
          id="productManager"
          name="productManager"
          value={formData.productManager}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Product Manager</option>
          {data.teamMembers
            .filter(m => m.role === 'product' && m.status === 'active')
            .map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="deliveryLead" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Lead
        </label>
        <select
          id="deliveryLead"
          name="deliveryLead"
          value={formData.deliveryLead}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Delivery Lead</option>
          {data.teamMembers
            .filter(m => m.role === 'delivery' && m.status === 'active')
            .map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {team ? 'Update' : 'Create'} Team
        </button>
      </div>
    </form>
  );
}
