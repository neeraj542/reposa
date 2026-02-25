
# Reposa

Reposa (Repository Analyzer) is a backend-driven system designed to analyze GitHub repositories on demand and identify structured open-source contribution opportunities.

The platform evaluates issues, labels, technologies, and repository metadata to generate actionable insights for developers seeking meaningful contributions.

The design emphasizes structured analysis, API-driven architecture, and scalable backend processing.

---

## Overview

Reposa performs dynamic analysis of any public GitHub repository by:

* Fetching repository metadata and issue data via the GitHub API
* Classifying issues by type and difficulty
* Extracting technology stack information
* Identifying contribution readiness signals
* Aggregating repository statistics

The system is designed for extensibility and performance, with clear separation between API handling, analysis logic, and storage layers.

---

## Core Capabilities

* On-demand repository analysis
* Issue classification (bug, feature, documentation, enhancement)
* Difficulty estimation (good first issue, easy, medium, hard)
* Skill and language extraction
* Aggregated repository metrics
* Caching for performance optimization
* RESTful API interface

---

## System Architecture

### Backend

* Go 1.21+
* Fiber (HTTP framework)
* PostgreSQL (persistent storage)
* GitHub REST API integration
* Layered architecture (API → Analyzer → Storage)

### Frontend

* React 19 with TypeScript
* Vite build system
* Tailwind CSS
* Vitest and React Testing Library

The backend is fully functional and can operate independently of the frontend.

---

## Installation

### Prerequisites

* Go 1.21 or higher
* PostgreSQL 14+
* GitHub Personal Access Token

Verify Go installation:

```bash
go version
```

---

### Clone Repository

```bash
git clone https://github.com/yourusername/reposa.git
cd reposa
```

---

### Backend Setup

```bash
cd backend
go mod download
```

Create environment configuration:

```bash
cp .env.example .env
```

Edit `.env` and configure:

* Database connection string
* GitHub Personal Access Token
* Server port

---

### Run the Backend

```bash
go run cmd/server/main.go
```

Server will start on the configured port (default: 3000).

---

## API Usage

### Analyze Repository

```http
POST /api/analyze
Content-Type: application/json
```

Request body:

```json
{
  "repo_url": "https://github.com/owner/repository"
}
```

---

### Retrieve Analysis

```http
GET /api/analysis/{id}
```

Example:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/kubernetes/kubernetes"}'
```

Then:

```bash
curl http://localhost:3000/api/analysis/{id}
```

---

## Data Model Summary

Analysis response includes:

* Repository metadata
* Detected programming languages
* Issue breakdown
* Difficulty distribution
* Contribution indicators
* Statistical summary

The system stores results for reuse and avoids redundant GitHub API calls where possible.

---

## Project Structure

```
reposa/
├── backend/
│   ├── cmd/server/          # Application entry point
│   ├── internal/
│   │   ├── api/             # HTTP routing and handlers
│   │   ├── analyzer/        # Core repository analysis engine
│   │   ├── github/          # GitHub API client
│   │   ├── models/          # Domain models
│   │   └── storage/         # Database layer
│   ├── config/              # Configuration management
│   └── pkg/                 # Shared utilities
├── frontend/                # React frontend
├── docs/                    # Documentation
└── docker-compose.yml
```

The structure follows a layered design for maintainability and testability.

---

## Development

### Run Backend Tests

```bash
cd backend
go test ./...
```

### Linting

```bash
golangci-lint run
```

### Build Binary

```bash
go build -o bin/reposa cmd/server/main.go
```

---

## Design Considerations

* Clear separation of concerns
* API-first architecture
* Extensible analysis pipeline
* Structured error handling
* Rate-limit aware GitHub integration
* Cached analysis results for performance
* Minimal coupling between layers

The system prioritizes correctness and maintainability over premature optimization.

---

## Experimental Extensions

* ML-based issue difficulty classification
* Maintainer responsiveness scoring
* Repository health index
* Contributor skill matching engine
* Distributed analysis workers
* Dockerized deployment with CI/CD pipeline

---

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---
## Acknowledgments
- Thanks to the CNCF team for inspiring this project with CLOTributor
- GitHub for providing an excellent API
- The open source community for making this possible

## Contact 
- **Issues**: [GitHub Issues](https://github.com/neeraj542/reposa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/neeraj542/reposa/discussions)

--- 
**Made with ❤️ for the open source community**
