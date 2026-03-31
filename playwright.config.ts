import { defineConfig, devices } from '@playwright/test';

// Replay configuration: run tests using the local Chrome browser only.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    headless: false,
    baseURL: 'https://demoqa.com/',
    screenshot: 'only-on-failure',
    // trace: 'on-first-retry',  // commented out due to compatibility issue 
  },
  projects: [
    {
      name: 'chrome',
      // Use the installed Google Chrome browser (channel) for replaying locally.
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },

    // Other browsers are left here commented out for easy switching.
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
