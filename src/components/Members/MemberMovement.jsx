import { useState } from 'react';
import { useData } from '../../context/DataContext';

export default function MemberMovement({ member, onClose }) {
  const { data, moveMember } = useData();
  const [selectedTeamId, setSelectedTeamId] = useState(member.teamId || '');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTeamId) {
      alert('Please select a team');
      return;
    }

    if (selectedTeamId === member.teamId) {
      alert('Member is already in this team');
      return;
    }

    moveMember(member.id, selectedTeamId);
    alert(`${member.name} has been moved successfully`);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          <strong>Moving:</strong> {member.name}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          <strong>Current Team:</strong> {data.teams.find(t => t.id === member.teamId)?.name || 'Unassigned'}
        </p>
      </div>

      <div>
        <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-2">
          Select New Team
        </label>
        <select
          id="teamId"
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select a team</option>
          {data.teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name} ({data.pillars.find(p => p.id === team.pillarId)?.name})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Move Member
        </button>
      </div>
    </form>
  );
}
