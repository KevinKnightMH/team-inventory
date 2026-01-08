import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useSearchParams } from 'react-router-dom';
import { Download, FileText, FileJson } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import ExportData from './ExportData';

export default function ReportingDashboard() {
  const { data } = useData();
  const [searchParams] = useSearchParams();
  const reportParam = searchParams.get('report');
  const [selectedReport, setSelectedReport] = useState(reportParam || 'members');

  useEffect(() => {
    if (reportParam) {
      setSelectedReport(reportParam);
    }
  }, [reportParam]);

  const reports = {
    members: {
      name: 'All Members',
      description: 'Complete list of all team members with their details',
      data: data.teamMembers.map(m => ({
        name: m.name,
        email: m.email,
        role: m.role,
        team: data.teams.find(t => t.id === m.teamId)?.name || 'Unassigned',
        pillar: data.pillars.find(p => p.id === m.pillarId)?.name || 'Unassigned',
        location: m.location,
        status: m.status,
        startDate: m.startDate
      }))
    },
    activeMembers: {
      name: 'Active Members',
      description: 'Only active team members',
      data: data.teamMembers
        .filter(m => m.status === 'active')
        .map(m => ({
          name: m.name,
          email: m.email,
          role: m.role,
          team: data.teams.find(t => t.id === m.teamId)?.name || 'Unassigned',
          pillar: data.pillars.find(p => p.id === m.pillarId)?.name || 'Unassigned',
          location: m.location
        }))
    },
    teams: {
      name: 'Teams Overview',
      description: 'All teams with member counts',
      data: data.teams.map(t => ({
        team: t.name,
        pillar: data.pillars.find(p => p.id === t.pillarId)?.name || 'N/A',
        engineeringManager: data.teamMembers.find(m => m.id === t.engineeringManager)?.name || 'N/A',
        productManager: data.teamMembers.find(m => m.id === t.productManager)?.name || 'N/A',
        deliveryLead: data.teamMembers.find(m => m.id === t.deliveryLead)?.name || 'N/A',
        memberCount: t.members.length
      }))
    },
    pillars: {
      name: 'Pillars Overview',
      description: 'All pillars with team counts',
      data: data.pillars.map(p => ({
        pillar: p.name,
        engineeringLead: data.teamMembers.find(m => m.id === p.engineeringLead)?.name || 'N/A',
        productLead: data.teamMembers.find(m => m.id === p.productLead)?.name || 'N/A',
        deliveryOpsLead: data.teamMembers.find(m => m.id === p.deliveryOpsLead)?.name || 'N/A',
        teamCount: p.teams.length
      }))
    },
    openRoles: {
      name: 'Open Roles',
      description: 'All open positions across teams',
      data: data.openRoles.map(r => ({
        title: r.title,
        role: r.role,
        team: data.teams.find(t => t.id === r.teamId)?.name || 'N/A',
        pillar: data.pillars.find(p => p.id === r.pillarId)?.name || 'N/A',
        status: r.status,
        description: r.description
      }))
    },
    byRole: {
      name: 'Members by Role',
      description: 'Team members grouped by role',
      data: ['engineering', 'product', 'design', 'delivery', 'other'].map(role => ({
        role: role,
        activeCount: data.teamMembers.filter(m => m.role === role && m.status === 'active').length,
        onboardingCount: data.teamMembers.filter(m => m.role === role && m.status === 'onboarding').length,
        offboardingCount: data.teamMembers.filter(m => m.role === role && m.status === 'offboarding').length,
        totalCount: data.teamMembers.filter(m => m.role === role).length
      }))
    },
    audit: {
      name: 'Audit Log',
      description: 'All changes made to the system with user information',
      data: (data.auditLogs || [])
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(log => ({
          timestamp: new Date(log.timestamp).toLocaleString(),
          action: log.action,
          entityType: log.entityType,
          entityName: log.entityName,
          changedFrom: log.changedFrom || '-',
          changedTo: log.changedTo || '-',
          user: log.userName,
          userEmail: log.userEmail
        }))
    }
  };

  const currentReport = reports[selectedReport];

  const handleExportCSV = () => {
    exportToCSV(currentReport.data, `${selectedReport}-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportJSON = () => {
    exportToJSON(currentReport.data, `${selectedReport}-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <p className="text-gray-500 mt-1">Generate and export organizational reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(reports).map(([key, report]) => (
          <button
            key={key}
            onClick={() => setSelectedReport(key)}
            className={`p-4 text-left rounded-lg border-2 transition-all ${
              selectedReport === key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <h3 className="font-semibold text-gray-900">{report.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{report.description}</p>
            <p className="text-sm font-medium text-blue-600 mt-2">
              {report.data.length} record{report.data.length !== 1 ? 's' : ''}
            </p>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{currentReport.name}</h3>
            <p className="text-gray-500 mt-1">{currentReport.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="btn-primary flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="btn-secondary flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>

        {currentReport.data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available for this report</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {Object.keys(currentReport.data[0]).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReport.data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
