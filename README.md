# ASCII File Tree Generator

A small React app for generating clean ASCII directory trees from indented text, uploaded folders, or drag-and-drop folder structures.

## Features

- Convert indented text into ASCII file trees in real time
- Upload or drag a folder to generate a tree from local file paths
- Switch between monospace output and proportional spacing for chat apps
- Copy generated trees with a clipboard fallback
- SEO defaults for title, description, Open Graph, Twitter cards, and canonical metadata

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Project Structure

```text
src
  app
    App.tsx
  components
    seo
      Seo.tsx
      seoConfig.ts
  features
    tree-generator
      components
      hooks
      services
      types
      utils
  layouts
    AppLayout.tsx
  pages
    HomePage.tsx
```

The tree generator feature keeps UI components, hooks, browser file services, domain utilities, and shared types together while leaving page and layout concerns at the app level.

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run build
```

`npm run lint` runs TypeScript with `noEmit`.

## SEO

Static fallback metadata lives in `index.html` so crawlers receive useful defaults before React loads. Runtime metadata is managed by `src/components/seo/Seo.tsx`, with default values in `src/components/seo/seoConfig.ts`.

Update `siteSeo.url` and the canonical URL in `index.html` before deploying to your production domain.

## License

MIT
