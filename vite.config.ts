import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function copyChipsFile() {
  return {
    name: 'copy-chips-file',
    closeBundle() {
      mkdirSync(resolve('dist'), { recursive: true });
      copyFileSync(resolve('data/chips.json'), resolve('dist/chips.json'));
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
  plugins: [copyChipsFile()],
});
