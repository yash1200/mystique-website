<p align="center">
  <img src="static/brand/mystique-mark.svg" width="64" height="64" alt="Mystique logo" />
</p>

<h1 align="center">Mystique website</h1>

<p align="center">
  The landing page for <a href="https://github.com/yash1200/mystique">Mystique</a>, a calm, fast desktop client for PostgreSQL, MySQL, SQLite and MongoDB.
</p>

## Stack

- SvelteKit with Svelte 5 (runes)
- Tailwind CSS v4
- `@sveltejs/adapter-static`: every page is prerendered to plain HTML at build time

## Develop

You need Node 22+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

Other scripts:

```bash
pnpm check        # svelte-check + TypeScript
pnpm lint         # prettier + eslint
pnpm format       # prettier --write
```

## Build

```bash
pnpm build        # writes the static site to build/
pnpm preview      # serve the build locally
```

`build/` is a static site that any static host can serve, such as GitHub Pages, Netlify, Cloudflare Pages or S3.

- `index.html` is the prerendered landing page, with all content in the HTML.
- `404.html` is the SPA fallback for unknown paths.

If the site is served from a subpath (for example a GitHub Pages project page at `/mystique-website/`), set `paths.base` in `vite.config.ts`.

## Project layout

| Path                      | What it holds                                                     |
| ------------------------- | ----------------------------------------------------------------- |
| `src/routes/+page.svelte` | The whole landing page: nav, hero, features, databases, downloads |
| `src/routes/layout.css`   | Design tokens (colours, fonts, easing) and the shared card styles |
| `src/routes/+layout.ts`   | `prerender = true`                                                |
| `src/lib/reveal.ts`       | Scroll fade-in action (IntersectionObserver)                      |
| `src/app.html`            | Fonts, title, description and Open Graph tags                     |
| `static/`                 | App screenshot and brand marks                                    |

## Releasing a new app version

Download links point to versioned files on the app's GitHub release, so bump `VERSION` at the top of `src/routes/+page.svelte` after each Mystique release. The file names must match the release assets:

```bash
gh release view -R yash1200/mystique --json assets -q '.assets[].name'
```

## Brand

The logo, colours and tone follow the app's brand guide in [`mystique/static/brand`](https://github.com/yash1200/mystique/tree/main/static/brand). Don't redraw the dog mark. Production is always amber. No purple and no Inter.

## License

MIT, same as [Mystique](https://github.com/yash1200/mystique/blob/main/LICENSE).
