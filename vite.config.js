import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      input: { dashboard: 'dashboard.html', index: 'index.html' },
      output: {
        codeSplitting: {
          includeDependenciesRecursively: false,
          groups: [
            { name: 'shared', test: /shared\.(js|css)$/ },
            { name: 'feature', test: /feature\.(js|css)$/ },
          ],
        },
      },
    },
  },
});
