
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// গিটহাবে আপনার রিপোজিটরির নাম যদি হয় 'amar-khata', তাহলে base হবে '/amar-khata/'
// যদি আপনার প্রোফাইল পেজ (username.github.io) হয়, তাহলে base হবে '/'
export default defineConfig({
  base: './', 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
  }
});
