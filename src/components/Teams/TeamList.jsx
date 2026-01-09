import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import Table from '../Common/Table';
import Modal from '../Common/Modal';
import TeamForm from './TeamForm';
import { parseCSV, validateTeamCSV } from '../../utils/exportUtils';

export default function TeamList() {
  const { data, deleteTeam, getPillarById, getMemberById, createTeam } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDelete = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      const result = deleteTeam(teamId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleEdit = (team, e) => {
    e.stopPropagation();
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTeam(null);
  };

  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportErrors([]);
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const parsedData = parseCSV(csvText);

        // Validate the data
        const errors = validateTeamCSV(parsedData, data.pillars, data.teamMembers);
        if (errors.length > 0) {
          setImportErrors(errors);
          return;
        }

        // Import teams
        let importedCount = 0;
        parsedData.forEach(row => {
          // Find pillar by name
          const pillar = data.pillars.find(p => p.name.toLowerCase() === row.pillar.toLowerCase());

          // Find managers by email
          const engMgr = row.engineeringManager ? data.teamMembers.find(m => m.email.toLowerCase() === row.engineeringManager.toLowerCase()) : null;
          const prodMgr = row.productManager ? data.teamMembers.find(m => m.email.toLowerCase() === row.productManager.toLowerCase()) : null;
          const delLead = row.deliveryLead ? data.teamMembers.find(m => m.email.toLowerCase() === row.deliveryLead.toLowerCase()) : null;

          const teamData = {
            name: row.name.trim(),
            pillarId: pillar?.id || '',
            engineeringManager: engMgr?.id || '',
            productManager: prodMgr?.id || '',
            deliveryLead: delLead?.id || '',
            slackChannel: row.slackChannel || '',
            googleDrive: row.googleDrive || '',
            confluenceSpace: row.confluenceSpace || '',
            jiraSpace: row.jiraSpace || ''
          };

          createTeam(teamData);
          importedCount++;
        });

        setImportSuccess(`Successfully imported ${importedCount} team(s)`);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportErrors([error.message]);
      }
    };

    reader.readAsText(file);
  };

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const columns = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Pillar',
      render: (row) => getPillarById(row.pillarId)?.name || 'N/A'
    },
    {
      header: 'Engineering Manager',
      render: (row) => getMemberById(row.engineeringManager)?.name || 'N/A'
    },
    {
      header: 'Product Manager',
      render: (row) => getMemberById(row.productManager)?.name || 'N/A'
    },
    {
      header: 'Members',
      render: (row) => row.members.length
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => handleEdit(row, e)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
          <p className="text-gray-500 mt-1">Manage organizational teams</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            onClick={handleImportButtonClick}
            className="btn-secondary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Team
          </button>
        </div>
      </div>

      {importSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{importSuccess}</p>
        </div>
      )}

      {importErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-900 mb-2">Import Errors:</h3>
          <ul className="list-disc list-inside space-y-1">
            {importErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">{error}</li>
            ))}
          </ul>
          <p className="text-sm text-red-600 mt-3">
            CSV Format: name,pillar,engineeringManager,productManager,deliveryLead,slackChannel,googleDrive,confluenceSpace,jiraSpace
          </p>
          <p className="text-sm text-red-600">
            Example: Infrastructure,Platform Engineering,amanda.f@company.com,jennifer.lee@company.com,tom.h@company.com,https://slack.com/...,https://drive.google.com/...,https://confluence.com/...,https://jira.com/...
          </p>
        </div>
      )}

      <div className="card">
        <Table
          columns={columns}
          data={data.teams}
          onRowClick={(team) => navigate(`/teams/${team.id}`)}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingTeam ? 'Edit Team' : 'Add New Team'}
      >
        <TeamForm team={editingTeam} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
