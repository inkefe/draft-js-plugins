import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import linaria from 'vite-plugin-linaria-styled';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    linaria({
      sourceMap: true,
      classNameSlug: '[title]-[hash]',
      cacheDirectory: '.linaria-cache',
    }),
  ],
});
