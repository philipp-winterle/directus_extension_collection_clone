# Contributing to Directus Collection Clone Extension

Thank you for your interest in contributing to the Directus Collection Clone Extension! This document provides guidelines and instructions for contributing to this project.

## Development Setup

### Prerequisites

- Directus v11.0.0 or higher
- Node.js v18 or higher
- npm v8 or higher

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/directus_extension_collection_clone.git
   ```
3. Navigate to the extension directory
4. Install dependencies:
   ```bash
   npm install
   ```

## Project Structure

```
directus_extension_collection_clone/
├── src/
│   ├── directus_module_collection_clone/      # Module extension code
│   │   ├── components/                        # Vue components
│   │   │   ├── Table.vue                      # Collections table component
│   │   │   ├── CloneCollectionModal.vue       # Clone modal component
│   │   │   └── ActionButton.vue               # Action button component
│   │   ├── module.vue                         # Main module component
│   │   └── index.ts                           # Module entry point
│   ├── directus_endpoint_collection_clone/    # Endpoint extension code
│   │   ├── utils.ts                           # Utility functions
│   │   └── index.ts                           # Endpoint entry point
│   └── types/                                 # TypeScript type definitions
├── package.json
└── README.md
```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the extension code

3. Run the development build to test your changes:
   ```bash
   npm run dev
   ```

4. Test your changes in a local Directus instance by copying the built extension to your Directus extensions directory:
   ```bash
   cp -r dist/* /path/to/directus/extensions/
   ```

5. Restart your Directus instance to see your changes

6. When ready, build the extension for production:
   ```bash
   npm run build
   ```

## Code Style Guidelines

- Follow the existing code style and structure
- Use TypeScript for all new files
- Use Vue's Composition API for new components
- Write descriptive commit messages
- Include comments for complex logic

## Testing

- Test all changes in a local Directus instance before submitting a pull request
- Ensure that your changes don't break existing functionality
- Test with different collection types to ensure compatibility

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure that your code follows the code style guidelines
3. Make sure all tests pass
4. Submit a pull request with a clear description of the changes

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(modal): add error handling to clone modal

- Adds error state to modal
- Displays error messages from API
- Shows a red 'Close' button when errors occur
```

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 
