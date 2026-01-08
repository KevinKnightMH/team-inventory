import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Users, Briefcase } from 'lucide-react';

export default function PillarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPillarById, getTeamsByPillar, getMemberById } = useData();

  const pillar = getPillarById(id);
  const teams = getTeamsByPillar(id);

  if (!pillar) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Pillar not found</p>
        <button onClick={() => navigate('/pillars')} className="btn-primary mt-4">
          Back to Pillars
        </button>
      </div>
    );
  }

  const engLead = getMemberById(pillar.engineeringLead);
  const prodLead = getMemberById(pillar.productLead);
  const delLead = getMemberById(pillar.deliveryOpsLead);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/pillars')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Pillars
      </button>

      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{pillar.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Engineering Lead</p>
            <p className="text-lg text-gray-900">{engLead?.name || 'Not assigned'}</p>
            {engLead && <p className="text-sm text-gray-500">{engLead.email}</p>}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Product Lead</p>
            <p className="text-lg text-gray-900">{prodLead?.name || 'Not assigned'}</p>
            {prodLead && <p className="text-sm text-gray-500">{prodLead.email}</p>}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Delivery Ops Lead</p>
            <p className="text-lg text-gray-900">{delLead?.name || 'Not assigned'}</p>
            {delLead && <p className="text-sm text-gray-500">{delLead.email}</p>}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Teams ({teams.length})</h2>
          </div>

          {teams.length === 0 ? (
            <p className="text-gray-500">No teams in this pillar</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map(team => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <h3 className="font-medium text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
