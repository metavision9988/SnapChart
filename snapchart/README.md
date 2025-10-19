# SnapChart MVP - Monorepo

AI로 3초 만에 다이어그램을 생성하는 SnapChart의 MVP 버전입니다.

## 🏗️ Project Structure

```
snapchart/
├── apps/
│   ├── api/          # Backend API (Hono + SQLite)
│   └── web/          # Frontend (React + Vite)
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utility functions
└── turbo.json        # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites

- **Bun** 1.1+ or Node.js 20+
- **Git**

### Installation

```bash
# Clone the repository
cd snapchart

# Install dependencies
bun install

# Set up environment variables
cd apps/api
cp .env.example .env
# Edit .env and add your API keys:
# - GEMINI_API_KEY
# - ANTHROPIC_API_KEY
```

### Development

```bash
# Run all apps in development mode
bun run dev

# Or run individually:
# Backend API (http://localhost:8787)
cd apps/api
bun run dev

# Frontend (http://localhost:5173)
cd apps/web
bun run dev
```

### Testing

```bash
# Run all tests
bun run test

# Run tests with coverage
cd packages/utils
bun run test -- --coverage

# Run specific test file
cd apps/api
bun test src/routes/health.test.ts

# Run tests in watch mode
bun test --watch
```

### Building

```bash
# Build all packages
bun run build

# Build specific package
cd apps/api
bun run build
```

## 📦 Packages

### `@snapchart/api`

Backend API built with:
- **Hono** - Fast web framework
- **SQLite** (better-sqlite3) - Local database
- **In-memory cache** - Simple caching layer
- **Zod** - Schema validation

**Endpoints:**
- `GET /health` - Health check
- `POST /api/diagrams/generate` - Generate diagram
- `GET /api/diagrams/stats` - Usage statistics
- `GET /api/diagrams/recent` - Recent diagrams

### `@snapchart/web`

Frontend application built with:
- **React 19** - UI library
- **Vite 6** - Build tool
- **TailwindCSS 4** - Styling
- **React Query** - Server state management
- **Mermaid.js** - Diagram rendering

### `@snapchart/types`

Shared TypeScript types for both frontend and backend.

### `@snapchart/utils`

Shared utility functions:
- **validation** - Input validation utilities
- **hash** - Hashing and ID generation
- **string** - String manipulation
- **time** - Time and duration utilities

## 🧪 Testing Strategy

This project follows **Test-Driven Development (TDD)** with the RED-GREEN-REFACTOR approach:

### Test Structure

```
packages/utils/
└── src/
    ├── validation.ts
    ├── validation.test.ts  ✅ Unit tests
    ├── hash.ts
    └── hash.test.ts        ✅ Unit tests

apps/api/
└── src/
    ├── routes/
    │   ├── health.ts
    │   └── health.test.ts  ✅ Integration tests
    └── lib/
        ├── cache-manager.ts
        └── cache-manager.test.ts  ✅ Unit tests

apps/web/
└── src/
    ├── components/
    │   ├── DiagramInput.tsx
    │   └── DiagramInput.test.tsx  ✅ Component tests
    └── hooks/
        ├── useGenerateDiagram.ts
        └── useGenerateDiagram.test.ts  ✅ Hook tests
```

### Running Tests

```bash
# All tests
bun run test

# With coverage
bun run test -- --coverage

# Watch mode
bun test --watch

# Specific package
cd packages/utils
bun test
```

## 🔧 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Write Tests First (TDD)**
   ```bash
   # Create test file
   touch src/feature.test.ts
   # Write failing tests (RED)
   ```

3. **Implement Feature**
   ```bash
   # Write minimal code to pass tests (GREEN)
   bun test --watch
   ```

4. **Refactor**
   ```bash
   # Improve code quality while keeping tests green (REFACTOR)
   ```

5. **Run All Tests**
   ```bash
   bun run test
   bun run type-check
   bun run lint
   ```

6. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature
   ```

## 📊 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Bun | Fast JavaScript runtime |
| Backend | Hono | Web framework |
| Database | SQLite | Local database |
| Frontend | React 19 | UI library |
| Build | Vite 6 | Fast build tool |
| Styling | TailwindCSS 4 | Utility-first CSS |
| State | React Query | Server state |
| Diagrams | Mermaid.js | Diagram rendering |
| Monorepo | Turborepo | Build orchestration |
| Testing | Vitest | Unit/integration tests |
| Types | TypeScript 5.7 | Type safety |

## 🎯 Diagram Types Supported

1. **Flowchart** - 플로우차트
2. **Sequence** - 시퀀스 다이어그램
3. **Pie** - 파이 차트
4. **Gantt** - 간트 차트
5. **ER** - ER 다이어그램
6. **State** - 상태 다이어그램
7. **Journey** - User Journey
8. **Graph** - 조직도

## 🔑 Environment Variables

### Backend (`apps/api/.env`)

```env
PORT=8787
NODE_ENV=development
DB_PATH=./data/snapchart.db
GEMINI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
CACHE_TTL=86400
```

## 📝 API Documentation

### Generate Diagram

```bash
POST /api/diagrams/generate
Content-Type: application/json

{
  "type": "flowchart",
  "prompt": "로그인 프로세스 플로우차트"
}

Response:
{
  "id": "abc123",
  "type": "flowchart",
  "code": "graph TD\n  A-->B",
  "duration": 1234,
  "provider": "gemini",
  "attempts": 1,
  "cached": false,
  "timestamp": "2025-01-15T00:00:00Z"
}
```

### Health Check

```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2025-01-15T00:00:00Z"
}
```

## 🚦 Quality Gates

Before merging to main:
- ✅ All tests passing
- ✅ Type check passing
- ✅ Lint check passing
- ✅ Build successful

```bash
bun run test
bun run type-check
bun run lint
bun run build
```

## 📖 Further Documentation

- [TDD Implementation Plan](../docs/SnapChart%20TDD%20개발%20구현%20계획서.md)
- [PoC Final Report](../docs/POC-FINAL-REPORT.md)
- [Improvement Report](../docs/IMPROVEMENT-REPORT-v2.md)

## 🤝 Contributing

1. Follow TDD approach (RED-GREEN-REFACTOR)
2. Write tests for all new features
3. Ensure type safety with TypeScript
4. Follow existing code patterns
5. Run quality checks before committing

## 📄 License

MIT
