import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function PillarForm({ pillar, onClose }) {
  const { data, createPillar, updatePillar } = useData();
  const [formData, setFormData] = useState({
    name: pillar?.name || '',
    engineeringLead: pillar?.engineeringLead || '',
    productLead: pillar?.productLead || '',
    deliveryOpsLead: pillar?.deliveryOpsLead || '',
    slackChannel: pillar?.slackChannel || '',
    googleDrive: pillar?.googleDrive || '',
    confluenceSpace: pillar?.confluenceSpace || '',
    jiraSpace: pillar?.jiraSpace || ''
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

      <div className="border-t border-gray-200 pt-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Collaboration Links (Optional)</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="slackChannel" className="block text-sm font-medium text-gray-700 mb-2">
              Slack Channel URL
            </label>
            <input
              id="slackChannel"
              name="slackChannel"
              type="url"
              value={formData.slackChannel}
              onChange={handleChange}
              className="input-field"
              placeholder="https://company.slack.com/archives/..."
            />
          </div>

          <div>
            <label htmlFor="googleDrive" className="block text-sm font-medium text-gray-700 mb-2">
              Google Drive URL
            </label>
            <input
              id="googleDrive"
              name="googleDrive"
              type="url"
              value={formData.googleDrive}
              onChange={handleChange}
              className="input-field"
              placeholder="https://drive.google.com/drive/folders/..."
            />
          </div>

          <div>
            <label htmlFor="confluenceSpace" className="block text-sm font-medium text-gray-700 mb-2">
              Confluence Space URL
            </label>
            <input
              id="confluenceSpace"
              name="confluenceSpace"
              type="url"
              value={formData.confluenceSpace}
              onChange={handleChange}
              className="input-field"
              placeholder="https://company.atlassian.net/wiki/spaces/..."
            />
          </div>

          <div>
            <label htmlFor="jiraSpace" className="block text-sm font-medium text-gray-700 mb-2">
              Jira Space URL
            </label>
            <input
              id="jiraSpace"
              name="jiraSpace"
              type="url"
              value={formData.jiraSpace}
              onChange={handleChange}
              className="input-field"
              placeholder="https://company.atlassian.net/browse/..."
            />
          </div>
        </div>
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
