# Reposa Frontend

Beautiful, modern React + TypeScript frontend for Reposa - the GitHub Repository Analyzer.

## Features

- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 🚀 **Fast** - Built with Vite for lightning-fast development
- 📱 **Responsive** - Works perfectly on all devices
- 🎯 **Type-Safe** - Full TypeScript support
- 🌈 **Beautiful** - Tailwind CSS with custom design system

## Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── api/
│   └── client.ts          # API client
├── components/
│   ├── SearchForm.tsx     # Repository search form
│   ├── IssueCard.tsx      # Individual issue card
│   └── ResultsDisplay.tsx # Results display
├── types.ts               # TypeScript types
├── App.tsx                # Main app component
└── index.css              # Global styles
```

## Features

### Search Form
- Input GitHub repository URL
- Example repositories for quick testing
- Loading states
- Error handling

### Results Display
- Repository information (stars, forks, languages, topics)
- Statistics dashboard
- Issue cards with:
  - Difficulty badges
  - Type badges (bug, feature, docs)
  - Good first issue indicator
  - Mentor availability
  - Labels
  - Direct links to GitHub

### Design System

Custom Tailwind classes:
- `.glass-card` - Glassmorphism card effect
- `.btn-primary` - Primary button style
- `.input-field` - Form input style
- `.badge-*` - Various badge styles

## License

Apache 2.0
