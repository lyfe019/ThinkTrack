#!/bin/bash

# 1. Environment Configuration
cat <<EOF > .env
NODE_ENV=development
PORT=3000
HOST=127.0.0.1
LOG_LEVEL=info
EOF

# 2. Git Configuration
cat <<EOF > .gitignore
node_modules/
dist/
build/
logs/
*.log
.env
coverage/
.vscode/
.DS_Store
EOF

# 3. Cucumber (BDD) Configuration
cat <<EOF > cucumber.js
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/e2e/features/**/*.ts'],
    paths: ['tests/e2e/features/**/*.feature'],
    format: ['progress', 'summary'],
    publishQuiet: true
  }
};
EOF

# 4. Docker Multi-Stage Build
cat <<EOF > Dockerfile
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend Setup
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=frontend-builder /app/frontend/dist ./public
EXPOSE 3000
CMD npx ts-node src/server.ts --port \$PORT
EOF

# 5. Playwright (UI Test) Configuration
cat <<EOF > playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/ui',
  timeout: 60 * 1000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npx ts-node src/server.ts',
      url: 'http://127.0.0.1:3000/',
      reuseExistingServer: true,
    },
    {
      command: 'cd frontend && npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    }
  ],
});
EOF

# 6. TypeScript Configuration
cat <<EOF > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "tests", "frontend"]
}
EOF

chmod +x finalize-config.sh
echo "✅ Project configurations (Docker, TS, Testing) finalized."