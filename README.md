# ichiza-docs

Official documentation site for the **ichiza（一座）** family:

- [`gr1m0h/ichiza`](https://github.com/gr1m0h/ichiza) — Technical meetup operations as Code: CLI, composite actions, and the optional Hono + Cloudflare Workers web cockpit.
- [`gr1m0h/ichiza-starter`](https://github.com/gr1m0h/ichiza-starter) — Pre-wired operations repository built around one Dashboard Issue per event.

Published at **<https://ichiza.grimoh.net>**.

## Local development

```bash
npm install
npm run start    # http://localhost:3000
npm run build    # production build in ./build
```

Requires Node.js 18 or newer.

## Repository layout

```
docs/                 # Markdown content (Japanese)
src/css/custom.css    # Theme tweaks (stage-curtain red)
src/pages/            # Landing page
static/img/           # Logo, favicon, social card
sidebars.ts           # Sidebar layout
docusaurus.config.ts  # Site configuration
```

## Contributing

1. Edit Markdown under `docs/`.
2. `npm run start` to preview locally.
3. Open a PR.

## License

MIT
