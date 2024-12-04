import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use this property to control threading and sequence
    sequence: {
      shuffle: false, // Ensures tests run in declared order
    },
    testTimeout: 1000,
    fileParallelism: false, // Disables parallel threads
  },
});
