# Reposa - Quick Start Guide

## What is Reposa?

Reposa analyzes GitHub repositories to find contribution opportunities. Just give it a repo URL and it will:
- Find open issues labeled "help wanted"
- Categorize by difficulty (easy, medium, hard)
- Identify good first issues
- Show required skills/languages
- Calculate statistics

## Installation

```bash
# 1. Navigate to backend
cd reposa/backend

# 2. Set up environment
cp .env.example .env
# Edit .env and add your GitHub token

# 3. Run the server
go run cmd/server/main.go
```

## Usage

### Analyze a Repository

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/owner/repo"}'
```

### Example Repositories to Try

```bash
# Small repo (fast)
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/neeraj542/clotributor"}'

# Medium repo
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/golang/go"}'
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/analyze` | Analyze repository |

## Need Help?

- Check [README.md](../README.md) for detailed docs
- See [CONTRIBUTING.md](../CONTRIBUTING.md) to contribute
- Open an issue on GitHub

---

**Built with Go + Fiber | Licensed under Apache 2.0**
