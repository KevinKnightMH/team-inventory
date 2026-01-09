import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import Table from '../Common/Table';
import Modal from '../Common/Modal';
import PillarForm from './PillarForm';
import { parseCSV, validatePillarCSV } from '../../utils/exportUtils';

export default function PillarList() {
  const { data, deletePillar, getMemberById, createPillar } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPillar, setEditingPillar] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDelete = (pillarId) => {
    if (window.confirm('Are you sure you want to delete this pillar?')) {
      const result = deletePillar(pillarId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  const handleEdit = (pillar, e) => {
    e.stopPropagation();
    setEditingPillar(pillar);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPillar(null);
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
        const errors = validatePillarCSV(parsedData, data.teamMembers);
        if (errors.length > 0) {
          setImportErrors(errors);
          return;
        }

        // Import pillars
        let importedCount = 0;
        parsedData.forEach(row => {
          // Find leads by email
          const engLead = row.engineeringLead ? data.teamMembers.find(m => m.email.toLowerCase() === row.engineeringLead.toLowerCase()) : null;
          const prodLead = row.productLead ? data.teamMembers.find(m => m.email.toLowerCase() === row.productLead.toLowerCase()) : null;
          const delLead = row.deliveryOpsLead ? data.teamMembers.find(m => m.email.toLowerCase() === row.deliveryOpsLead.toLowerCase()) : null;

          const pillarData = {
            name: row.name.trim(),
            engineeringLead: engLead?.id || '',
            productLead: prodLead?.id || '',
            deliveryOpsLead: delLead?.id || '',
            slackChannel: row.slackChannel || '',
            googleDrive: row.googleDrive || '',
            confluenceSpace: row.confluenceSpace || '',
            jiraSpace: row.jiraSpace || ''
          };

          createPillar(pillarData);
          importedCount++;
        });

        setImportSuccess(`Successfully imported ${importedCount} pillar(s)`);
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
      header: 'Engineering Lead',
      render: (row) => getMemberById(row.engineeringLead)?.name || 'N/A'
    },
    {
      header: 'Product Lead',
      render: (row) => getMemberById(row.productLead)?.name || 'N/A'
    },
    {
      header: 'Delivery Ops Lead',
      render: (row) => getMemberById(row.deliveryOpsLead)?.name || 'N/A'
    },
    {
      header: 'Teams',
      render: (row) => row.teams.length
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
          <h2 className="text-2xl font-bold text-gray-900">Pillars</h2>
          <p className="text-gray-500 mt-1">Manage organizational pillars</p>
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
            Add Pillar
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
            CSV Format: name,engineeringLead,productLead,deliveryOpsLead,slackChannel,googleDrive,confluenceSpace,jiraSpace
          </p>
          <p className="text-sm text-red-600">
            Example: Platform Engineering,amanda.f@company.com,jennifer.lee@company.com,tom.h@company.com,https://slack.com/...,https://drive.google.com/...,https://confluence.com/...,https://jira.com/...
          </p>
        </div>
      )}

      <div className="card">
        <Table
          columns={columns}
          data={data.pillars}
          onRowClick={(pillar) => navigate(`/pillars/${pillar.id}`)}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingPillar ? 'Edit Pillar' : 'Add New Pillar'}
      >
        <PillarForm pillar={editingPillar} onClose={handleCloseForm} />
      </Modal>
    </div>
  );
}
