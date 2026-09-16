import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'website',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
  },
});
