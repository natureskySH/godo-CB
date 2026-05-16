import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      mkdirSync(resolve('dist'), { recursive: true });
      copyFileSync(resolve('data/chips.json'), resolve('dist/chips.json'));
      copyFileSync(
        resolve('src/presentation/assets/chatbot-avatar.png'),
        resolve('dist/chatbot-avatar.png'),
      );
    },
  };
}

export default defineConfig({
  publicDir: false,
  build: {
    target: 'es2022',
    lib: {
      entry: 'src/entry.ts',
      formats: ['iife'],
      name: 'GodoChatbot',
      fileName: () => 'godo-chatbot.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  plugins: [copyStaticAssets()],
});
