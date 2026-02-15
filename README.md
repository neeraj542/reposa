# Reposa 🔍

**Reposa** (Repository Analyzer) - Discover contribution opportunities in any GitHub repository instantly.

## What is Reposa?

Reposa analyzes GitHub repositories on-demand to help developers find great opportunities to contribute to open source projects. Simply input a repository URL and get instant insights about:

- 🎯 Open issues looking for help
- 🏷️ Issue categorization (bug, feature, documentation)
- 📊 Difficulty levels (good first issue, easy, medium, hard)
- 💻 Required skills and technologies
- 📝 Contribution guidelines
- 👥 Maintainer availability

## Features

- **On-Demand Analysis**: Analyze any GitHub repository instantly
- **Smart Categorization**: Automatically categorizes issues by type and difficulty
- **Skill Matching**: Identifies required programming languages and technologies
- **Contribution Ready**: Links to contribution guidelines and code of conduct
- **Fast & Efficient**: Caches results for quick repeated access

## Tech Stack

### Backend
- **Go 1.21+** - Fast, efficient, and reliable
- **Fiber** - Express-inspired web framework
- **PostgreSQL** - Robust data storage
- **GitHub API** - Official GitHub integration

### Frontend
- **React 19 + TypeScript** - Modern, type-safe UI
- **Vitest + RTL** - Modern testing suite
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Beautiful, responsive design

## Quick Start

### Prerequisites
- Go 1.21 or higher
- PostgreSQL 14+
- GitHub Personal Access Token ([Create one here](https://github.com/settings/tokens))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/reposa.git
cd reposa

# Set up backend
cd backend
go mod download

# Configure environment
cp .env.example .env
# Edit .env and add your GitHub token

# Run the server
go run cmd/server/main.go
```

### Usage

```bash
# Analyze a repository
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/kubernetes/kubernetes"}'

# Get analysis results
curl http://localhost:3000/api/analysis/{id}
```

## API Documentation

### Analyze Repository
```http
POST /api/analyze
Content-Type: application/json

{
  "repo_url": "https://github.com/owner/repo"
}
```

**Response:**
```json
{
  "id": "abc123",
  "repository": {
    "name": "repo",
    "owner": "owner",
    "description": "...",
    "stars": 1000,
    "languages": ["Go", "Python"]
  },
  "issues": [
    {
      "title": "Add feature X",
      "url": "https://github.com/...",
      "labels": ["help wanted", "good first issue"],
      "difficulty": "easy",
      "type": "feature"
    }
  ],
  "stats": {
    "total_issues": 10,
    "good_first_issues": 3,
    "help_wanted": 7
  }
}
```

## Project Structure

```
reposa/
├── backend/
│   ├── cmd/
│   │   └── server/          # Main application entry point
│   ├── internal/
│   │   ├── api/             # HTTP handlers and routes
│   │   ├── analyzer/        # Core analysis logic
│   │   ├── github/          # GitHub API client
│   │   ├── models/          # Data models
│   │   └── storage/         # Database layer
│   ├── pkg/                 # Public packages
│   └── config/              # Configuration files
├── frontend/                # React frontend (coming soon)
├── docs/                    # Documentation
└── docker-compose.yml       # Docker setup
```

## Development

### Running Tests

#### Backend
```bash
cd backend
go test ./...
```

#### Frontend
```bash
cd frontend
npm test
```

### Linting
```bash
golangci-lint run
```

### Building
```bash
go build -o bin/reposa cmd/server/main.go
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [x] Project setup and architecture
- [x] Core GitHub API integration
- [x] Issue analysis engine
- [x] REST API endpoints
- [x] Database integration
- [x] Caching layer
- [x] Frontend UI
- [x] Search functionality
- [x] Testing foundation
- [ ] Docker deployment
- [ ] CI/CD pipeline

## Inspiration

This project was inspired by [CLOTributor](https://clotributor.dev) by CNCF, which helps discover Cloud Native contribution opportunities. Reposa takes a different approach by providing on-demand analysis for any GitHub repository.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the CNCF team for inspiring this project with CLOTributor
- GitHub for providing an excellent API
- The open source community for making this possible

## Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/reposa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/reposa/discussions)

---

**Made with ❤️ for the open source community**
