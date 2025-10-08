# Contributing to Orbital AI Explorer

Thank you for your interest in contributing to Orbital AI Explorer! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, Python version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:
- A clear description of the enhancement
- Use cases and benefits
- Potential implementation approach
- Any relevant examples or mockups

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/orbital-ai-explorer.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding style guidelines below
   - Write clear, concise commit messages
   - Add tests if applicable
   - Update documentation as needed

4. **Test your changes**
   ```bash
   # Frontend
   cd frontend
   npm run lint
   npm run build
   
   # Express Backend
   cd backend/express
   npm run lint
   npm run build
   
   # FastAPI Backend
   cd backend/fastapi
   # Run tests when available
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Link any related issues

## Coding Style Guidelines

### TypeScript/JavaScript (Frontend & Express)

- Use TypeScript for all new code
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Use async/await over promises
- Keep functions small and focused

**Example:**
```typescript
/**
 * Fetches launch data by ID
 * @param id - The launch ID
 * @returns Promise with launch data
 */
export const getLaunchById = async (id: string): Promise<Launch> => {
  const response = await expressAPI.get(`/launches/${id}`);
  return response.data;
};
```

### Python (FastAPI)

- Follow PEP 8 style guide
- Use type hints for all functions
- Write docstrings for all functions and classes
- Keep functions focused on single responsibility
- Use async/await for I/O operations

**Example:**
```python
async def get_launch_insights(launch_id: str) -> Dict[str, Any]:
    """
    Generate AI-powered insights for a launch.
    
    Args:
        launch_id: The unique identifier of the launch
        
    Returns:
        Dictionary containing insights and analysis
    """
    # Implementation
    pass
```

### React Components

- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript interfaces for props
- Handle loading and error states
- Add meaningful prop validation

**Example:**
```typescript
interface DashboardProps {
  initialData?: DashboardStats;
  onRefresh?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  initialData, 
  onRefresh 
}) => {
  // Component implementation
};
```

## Project Structure

When adding new features, follow the existing structure:

```
frontend/src/
├── components/     # Reusable UI components
├── pages/         # Page-level components
├── services/      # API service functions
└── types/         # TypeScript type definitions

backend/express/src/
├── routes/        # API route handlers
├── services/      # Business logic
└── config/        # Configuration

backend/fastapi/app/
├── routes/        # API endpoints
├── services/      # AI and business logic
├── models/        # Data models and schemas
└── config/        # Configuration
```

## Testing

### Frontend Tests (Coming Soon)
```bash
cd frontend
npm test
```

### Backend Tests (Coming Soon)
```bash
# Express
cd backend/express
npm test

# FastAPI
cd backend/fastapi
pytest
```

## Documentation

When adding features, update:
- README.md (if it affects setup or usage)
- API.md (if adding/changing API endpoints)
- Code comments (for complex logic)
- Type definitions (keep them up to date)

## Commit Message Guidelines

Use clear, descriptive commit messages:

- **Add**: New feature or file
- **Update**: Modify existing feature
- **Fix**: Bug fix
- **Remove**: Delete code or files
- **Refactor**: Code restructuring
- **Docs**: Documentation changes
- **Style**: Code style changes (formatting, etc.)
- **Test**: Add or update tests

Examples:
```
Add: AI-powered launch recommendations
Fix: Database connection timeout issue
Update: Improve search performance
Docs: Add deployment guide
```

## Development Setup

See [GETTING_STARTED.md](docs/GETTING_STARTED.md) for detailed setup instructions.

## Review Process

1. All PRs require review before merging
2. Address review feedback promptly
3. Keep PRs focused on a single feature/fix
4. Ensure CI checks pass
5. Update documentation as needed

## Community

- Be respectful and constructive
- Help others when possible
- Share knowledge and best practices
- Celebrate successes together

## Questions?

If you have questions:
- Check existing documentation
- Search existing issues
- Create a new issue with the "question" label
- Reach out to maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Orbital AI Explorer! 🚀
