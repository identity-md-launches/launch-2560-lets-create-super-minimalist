import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { defineConfig } from 'vite';
import { App } from './src/App';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'render-project-index',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return html.replace('<!-- project-index -->', renderToStaticMarkup(createElement(App)));
        },
      },
    },
  ],
});
