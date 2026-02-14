# Contributing to Reposa

Thank you for your interest in contributing to Reposa! We welcome contributions from everyone.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Go version, etc.)
- Any relevant logs or screenshots

### Suggesting Features

Feature requests are welcome! Please open an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** with clear, descriptive commits
3. **Add tests** if applicable
4. **Ensure tests pass**: `go test ./...`
5. **Run linting**: `golangci-lint run`
6. **Format your code**: `gofmt -w .`
7. **Update documentation** if needed
8. **Submit a pull request**

### Commit Messages

Write clear, concise commit messages:
```
Add feature X to analyzer

- Implement feature X
- Add tests for feature X
- Update documentation
```

### Code Style

- Follow standard Go conventions
- Use `gofmt` for formatting
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage (>80%)

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reposa.git
   cd reposa
   ```

2. **Install dependencies**
   ```bash
   cd backend
   go mod download
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your GitHub token
   ```

4. **Run tests**
   ```bash
   go test ./...
   ```

5. **Run the server**
   ```bash
   go run cmd/server/main.go
   ```

## Project Structure

```
reposa/
├── backend/
│   ├── cmd/server/       # Main application
│   ├── internal/         # Private packages
│   │   ├── api/         # HTTP handlers
│   │   ├── analyzer/    # Analysis logic
│   │   ├── github/      # GitHub client
│   │   ├── models/      # Data models
│   │   └── storage/     # Database layer
│   └── pkg/             # Public packages
```

## Getting Help

- Open an issue for questions
- Join discussions in GitHub Discussions
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

Thank you for contributing to Reposa! 🎉
