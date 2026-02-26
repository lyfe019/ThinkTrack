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
