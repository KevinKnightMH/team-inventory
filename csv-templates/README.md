# CSV Import Templates

This folder contains CSV template files for importing data into the Team Inventory application.

## Available Templates

### 1. pillar-import-template.csv
Template for importing organizational pillars.

**Required Fields:**
- `name` - Name of the pillar (required)

**Optional Fields:**
- `engineeringLead` - Email address of the engineering lead
- `productLead` - Email address of the product lead
- `deliveryOpsLead` - Email address of the delivery ops lead
- `slackChannel` - URL to Slack channel
- `googleDrive` - URL to Google Drive folder
- `confluenceSpace` - URL to Confluence space
- `jiraSpace` - URL to Jira space

**Important:** Lead email addresses must match existing team members in the system.

---

### 2. team-import-template.csv
Template for importing teams.

**Required Fields:**
- `name` - Name of the team (required)
- `pillar` - Name of the pillar this team belongs to (required, must match existing pillar)

**Optional Fields:**
- `engineeringManager` - Email address of the engineering manager
- `productManager` - Email address of the product manager
- `deliveryLead` - Email address of the delivery lead
- `slackChannel` - URL to Slack channel
- `googleDrive` - URL to Google Drive folder
- `confluenceSpace` - URL to Confluence space
- `jiraSpace` - URL to Jira space

**Important:**
- Pillar name must match an existing pillar
- Manager email addresses must match existing team members

---

### 3. member-import-template.csv
Template for importing team members.

**Required Fields:**
- `name` - Full name of the team member (required)
- `email` - Email address (required, must be unique)
- `role` - One of: engineering, product, design, delivery, other (required)
- `location` - Location/office (required)

**Optional Fields:**
- `team` - Name of the team (must match existing team)
- `startDate` - Start date in YYYY-MM-DD format (defaults to today)
- `status` - One of: active, onboarding, offboarding (defaults to active)

**Important:** Team name must match an existing team if provided.

---

## How to Use

1. **Download the appropriate template** from this folder
2. **Edit the template** with your data:
   - Keep the header row unchanged
   - Replace the example data rows with your actual data
   - Delete any example rows you don't need
3. **Save the file** as CSV format
4. **Import in the application:**
   - Navigate to the appropriate screen (Pillars, Teams, or Members)
   - Click the "Import CSV" button
   - Select your CSV file
   - Review any validation errors and fix as needed

## Tips

- **Order matters for dependencies:**
  1. Import members first (so they can be assigned as leads/managers)
  2. Import pillars second (so they can be assigned to teams)
  3. Import teams third

- **Email addresses** are case-insensitive for lookups
- **Names** (pillar names, team names) are case-insensitive for lookups
- **Commas in data**: If your data contains commas, wrap the field in double quotes
- **Optional fields**: Leave them empty if you don't have the data
- **Validation**: The system will show detailed error messages if anything is wrong

## Example Import Order

```csv
# 1. First import members (member-import-template.csv)
# This creates the people who can be leads/managers

# 2. Then import pillars (pillar-import-template.csv)
# This creates the pillars and assigns leads

# 3. Finally import teams (team-import-template.csv)
# This creates teams under pillars with managers
```

## Audit Trail

All imports are automatically tracked in the audit log, recording:
- What was created
- When it was created
- Who performed the import
