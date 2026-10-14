import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4322/ancient-numbers/',
    headless: true,
    launchOptions: existsSync(localChrome) ? { executablePath: localChrome } : {},
    viewport: { width: 1440, height: 1000 },
  },
  webServer: {
    command: 'node scripts/serve-preview.mjs',
    url: 'http://127.0.0.1:4322/ancient-numbers/',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
