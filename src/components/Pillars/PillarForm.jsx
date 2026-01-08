import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function PillarForm({ pillar, onClose }) {
  const { data, createPillar, updatePillar } = useData();
  const [formData, setFormData] = useState({
    name: pillar?.name || '',
    engineeringLead: pillar?.engineeringLead || '',
    productLead: pillar?.productLead || '',
    deliveryOpsLead: pillar?.deliveryOpsLead || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pillar) {
      updatePillar(pillar.id, formData);
    } else {
      createPillar(formData);
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
          Pillar Name
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
        <label htmlFor="engineeringLead" className="block text-sm font-medium text-gray-700 mb-2">
          Engineering Lead
        </label>
        <select
          id="engineeringLead"
          name="engineeringLead"
          value={formData.engineeringLead}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Engineering Lead</option>
          {data.teamMembers
            .filter(m => m.role === 'engineering' && m.status === 'active')
            .map(member => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.email}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="productLead" className="block text-sm font-medium text-gray-700 mb-2">
          Product Lead
        </label>
        <select
          id="productLead"
          name="productLead"
          value={formData.productLead}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Product Lead</option>
          {data.teamMembers
            .filter(m => m.role === 'product' && m.status === 'active')
            .map(member => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.email}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label htmlFor="deliveryOpsLead" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Ops Lead
        </label>
        <select
          id="deliveryOpsLead"
          name="deliveryOpsLead"
          value={formData.deliveryOpsLead}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Select Delivery Ops Lead</option>
          {data.teamMembers
            .filter(m => m.role === 'delivery' && m.status === 'active')
            .map(member => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.email}
              </option>
            ))}
        </select>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {pillar ? 'Update' : 'Create'} Pillar
        </button>
      </div>
    </form>
  );
}
