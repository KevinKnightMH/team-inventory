import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowLeft, UserMinus, RefreshCcw, Edit } from 'lucide-react';
import Modal from '../Common/Modal';
import MemberMovement from './MemberMovement';
import MemberForm from './MemberForm';

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMemberById, getTeamById, getPillarById, offboardMember } = useData();
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const member = getMemberById(id);
  const team = getTeamById(member?.teamId);
  const pillar = getPillarById(member?.pillarId);

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Member not found</p>
        <button onClick={() => navigate('/members')} className="btn-primary mt-4">
          Back to Members
        </button>
      </div>
    );
  }

  const handleOffboard = () => {
    if (window.confirm(`Are you sure you want to offboard ${member.name}?`)) {
      offboardMember(member.id);
      alert(`${member.name} has been moved to offboarding status`);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/members')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Members
      </button>

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
            <p className="text-gray-500 mt-1">{member.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              member.status === 'active' ? 'bg-green-100 text-green-800' :
              member.status === 'onboarding' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {member.status}
            </span>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Member
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Role</p>
            <p className="text-lg text-gray-900 capitalize">{member.role}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
            <p className="text-lg text-gray-900">{member.location}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Start Date</p>
            <p className="text-lg text-gray-900">{member.startDate}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Team</p>
            {team ? (
              <Link to={`/teams/${team.id}`} className="text-lg text-blue-600 hover:underline">
                {team.name}
              </Link>
            ) : (
              <p className="text-lg text-gray-900">Unassigned</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pillar</p>
            {pillar ? (
              <Link to={`/pillars/${pillar.id}`} className="text-lg text-blue-600 hover:underline">
                {pillar.name}
              </Link>
            ) : (
              <p className="text-lg text-gray-900">Unassigned</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={() => setIsMovementModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Move to Another Team
          </button>

          {member.status === 'active' && (
            <button
              onClick={handleOffboard}
              className="btn-danger flex items-center gap-2"
            >
              <UserMinus className="w-4 h-4" />
              Initiate Offboarding
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        title="Move Team Member"
      >
        <MemberMovement member={member} onClose={() => setIsMovementModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Member"
      >
        <MemberForm member={member} onClose={() => setIsEditModalOpen(false)} />
      </Modal>
    </div>
  );
}
