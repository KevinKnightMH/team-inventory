export function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data, filename) {
  if (!data) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));

  // Parse rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted values
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim().replace(/^"(.*)"$/, '$1'));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^"(.*)"$/, '$1'));

    // Create object from headers and values
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}

export function validateMemberCSV(data, teams) {
  const errors = [];
  const validRoles = ['engineering', 'product', 'design', 'delivery', 'other'];
  const validStatuses = ['active', 'onboarding', 'offboarding'];

  data.forEach((row, index) => {
    const rowNum = index + 2; // +2 because index 0 is row 2 (after header)

    // Required fields
    if (!row.name || !row.name.trim()) {
      errors.push(`Row ${rowNum}: Name is required`);
    }
    if (!row.email || !row.email.trim()) {
      errors.push(`Row ${rowNum}: Email is required`);
    }
    if (!row.role || !row.role.trim()) {
      errors.push(`Row ${rowNum}: Role is required`);
    }
    if (!row.location || !row.location.trim()) {
      errors.push(`Row ${rowNum}: Location is required`);
    }

    // Validate role
    if (row.role && !validRoles.includes(row.role.toLowerCase())) {
      errors.push(`Row ${rowNum}: Invalid role "${row.role}". Must be one of: ${validRoles.join(', ')}`);
    }

    // Validate status (optional, defaults to 'active')
    if (row.status && !validStatuses.includes(row.status.toLowerCase())) {
      errors.push(`Row ${rowNum}: Invalid status "${row.status}". Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate team (optional)
    if (row.team && row.team.trim()) {
      const team = teams.find(t => t.name.toLowerCase() === row.team.toLowerCase());
      if (!team) {
        errors.push(`Row ${rowNum}: Team "${row.team}" not found`);
      }
    }

    // Validate email format
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push(`Row ${rowNum}: Invalid email format "${row.email}"`);
    }
  });

  return errors;
}

export function validatePillarCSV(data, teamMembers) {
  const errors = [];

  data.forEach((row, index) => {
    const rowNum = index + 2;

    // Required fields
    if (!row.name || !row.name.trim()) {
      errors.push(`Row ${rowNum}: Name is required`);
    }

    // Validate leads (optional but must exist if provided)
    if (row.engineeringLead && row.engineeringLead.trim()) {
      const lead = teamMembers.find(m => m.email.toLowerCase() === row.engineeringLead.toLowerCase());
      if (!lead) {
        errors.push(`Row ${rowNum}: Engineering Lead "${row.engineeringLead}" not found`);
      }
    }

    if (row.productLead && row.productLead.trim()) {
      const lead = teamMembers.find(m => m.email.toLowerCase() === row.productLead.toLowerCase());
      if (!lead) {
        errors.push(`Row ${rowNum}: Product Lead "${row.productLead}" not found`);
      }
    }

    if (row.deliveryOpsLead && row.deliveryOpsLead.trim()) {
      const lead = teamMembers.find(m => m.email.toLowerCase() === row.deliveryOpsLead.toLowerCase());
      if (!lead) {
        errors.push(`Row ${rowNum}: Delivery Ops Lead "${row.deliveryOpsLead}" not found`);
      }
    }
  });

  return errors;
}

export function validateTeamCSV(data, pillars, teamMembers) {
  const errors = [];

  data.forEach((row, index) => {
    const rowNum = index + 2;

    // Required fields
    if (!row.name || !row.name.trim()) {
      errors.push(`Row ${rowNum}: Name is required`);
    }

    if (!row.pillar || !row.pillar.trim()) {
      errors.push(`Row ${rowNum}: Pillar is required`);
    }

    // Validate pillar exists
    if (row.pillar && row.pillar.trim()) {
      const pillar = pillars.find(p => p.name.toLowerCase() === row.pillar.toLowerCase());
      if (!pillar) {
        errors.push(`Row ${rowNum}: Pillar "${row.pillar}" not found`);
      }
    }

    // Validate managers (optional but must exist if provided)
    if (row.engineeringManager && row.engineeringManager.trim()) {
      const manager = teamMembers.find(m => m.email.toLowerCase() === row.engineeringManager.toLowerCase());
      if (!manager) {
        errors.push(`Row ${rowNum}: Engineering Manager "${row.engineeringManager}" not found`);
      }
    }

    if (row.productManager && row.productManager.trim()) {
      const manager = teamMembers.find(m => m.email.toLowerCase() === row.productManager.toLowerCase());
      if (!manager) {
        errors.push(`Row ${rowNum}: Product Manager "${row.productManager}" not found`);
      }
    }

    if (row.deliveryLead && row.deliveryLead.trim()) {
      const lead = teamMembers.find(m => m.email.toLowerCase() === row.deliveryLead.toLowerCase());
      if (!lead) {
        errors.push(`Row ${rowNum}: Delivery Lead "${row.deliveryLead}" not found`);
      }
    }
  });

  return errors;
}
