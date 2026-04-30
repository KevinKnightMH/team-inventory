import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Users, MessageSquare, FolderOpen, FileText, ListTodo, ExternalLink, Edit, Plus } from 'lucide-react';
import Modal from '../Common/Modal';
import TeamForm from './TeamForm';
import MemberForm from '../Members/MemberForm';

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTeamById, getPillarById, getMemberById, getMembersByTeam } = useData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const team = getTeamById(id);
  const pillar = getPillarById(team?.pillarId);
  const members = getMembersByTeam(id);

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Team not found</p>
        <button onClick={() => navigate('/teams')} className="btn-primary mt-4">
          Back to Teams
        </button>
      </div>
    );
  }

  const engMgr = getMemberById(team.engineeringManager);
  const prodMgr = getMemberById(team.productManager);
  const delLead = getMemberById(team.deliveryLead);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/teams')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Teams
      </button>

      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-500 mt-1">
              Pillar: <Link to={`/pillars/${pillar?.id}`} className="text-blue-600 hover:underline">{pillar?.name}</Link>
            </p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Engineering Manager</p>
            <p className="text-lg text-gray-900">{engMgr?.name || 'Not assigned'}</p>
            {engMgr && <p className="text-sm text-gray-500">{engMgr.email}</p>}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Product Manager</p>
            <p className="text-lg text-gray-900">{prodMgr?.name || 'Not assigned'}</p>
            {prodMgr && <p className="text-sm text-gray-500">{prodMgr.email}</p>}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Delivery Lead</p>
            <p className="text-lg text-gray-900">{delLead?.name || 'Not assigned'}</p>
            {delLead && <p className="text-sm text-gray-500">{delLead.email}</p>}
          </div>
        </div>

        {/* Collaboration Links Panel */}
        <div className="border-t border-gray-200 pt-6 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.slackChannel && (
              <a
                href={team.slackChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-all group"
              >
                <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Slack Channel</p>
                  <p className="text-xs text-gray-600 truncate">Team discussions</p>
                </div>
                <ExternalLink className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {team.googleDrive && (
              <a
                href={team.googleDrive}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:shadow-md transition-all group"
              >
                <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Google Drive</p>
                  <p className="text-xs text-gray-600 truncate">Documents & files</p>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {team.confluenceSpace && (
              <a
                href={team.confluenceSpace}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition-all group"
              >
                <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Confluence</p>
                  <p className="text-xs text-gray-600 truncate">Documentation</p>
                </div>
                <ExternalLink className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {team.jiraSpace && (
              <a
                href={team.jiraSpace}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:shadow-md transition-all group"
              >
                <ListTodo className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Jira</p>
                  <p className="text-xs text-gray-600 truncate">Project tracking</p>
                </div>
                <ExternalLink className="w-4 h-4 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Team Members ({members.length})</h2>
            </div>
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No members in this team yet</p>
              <button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map(member => (
                <Link
                  key={member.id}
                  to={`/members/${member.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{member.email}</p>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{member.role}</p>
                  {member.location && (
                    <p className="text-sm text-gray-600 mt-1">{member.location}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Team"
      >
        <TeamForm team={team} onClose={() => setIsEditModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add New Member"
      >
        <MemberForm
          member={{ teamId: team?.id }}
          onClose={() => setIsAddMemberModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
