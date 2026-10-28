import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Listen on IPv4 explicitly: with the default, Node on Windows can bind only to [::1], and
  // browsers that resolve "localhost" to 127.0.0.1 then can't connect.
  server: {
    host: '127.0.0.1',
    port: 5173,
    // assets/ holds the original photos (served copies live in public/img); not watching it
    // stops a file still downloading there (locked by the browser) from crashing the server.
    watch: { ignored: ['**/assets/**'] },
  },
  preview: { host: '127.0.0.1', port: 4173 },
});
