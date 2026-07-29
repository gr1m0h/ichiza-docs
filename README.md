# ichiza-docs

Official documentation site for the **ichiza（一座）** family:

- [`gr1m0h/ichiza`](https://github.com/gr1m0h/ichiza) — Community event operations as Code. CLI + composite actions for meetup operations (scaffold, remind, speakers).
- [`gr1m0h/ichiza-starter`](https://github.com/gr1m0h/ichiza-starter) — Template repository communities clone to get a pre-wired operations repo.

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
