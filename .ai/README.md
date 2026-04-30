# AI Assistant Context Directory

This directory contains documentation for AI coding assistants (Claude, GitHub Copilot, Cursor, etc.) to understand the project structure, deployment process, and data architecture.

## Files

### `project.md`
High-level project overview including:
- Tech stack
- Feature list
- Architecture
- Development workflow
- Common patterns

### `deployment.md`
Comprehensive deployment guide covering:
- Manual Docker deployment to Cloud Run
- Environment variables
- OAuth configuration
- Monitoring & troubleshooting
- Rollback procedures

### `data-sources.md`
Data architecture documentation:
- Current localStorage implementation
- Data models and relationships
- CRUD operations
- Future backend migration plans
- Third-party integration roadmap

## Usage

AI assistants can reference these files to:
- Understand project context without reading entire codebase
- Get deployment instructions
- Learn data models and relationships
- Follow established patterns and conventions
- Avoid common pitfalls

## Keeping Updated

Update these files when:
- Adding new features
- Changing deployment process
- Modifying data models
- Adding dependencies
- Changing environment variables
- Updating infrastructure

## Related Documentation

- `.claude/CLAUDE.md` - Claude-specific instructions
- `README.md` - User-facing project documentation
- `CLOUD_RUN_DEPLOYMENT.md` - Cloud Run deployment guide
- `ARCHITECTURE.md` - Detailed architecture documentation
