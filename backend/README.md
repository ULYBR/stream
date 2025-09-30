# NestJS Boilerplate

This repository is a generic NestJS backend boilerplate. It includes basic
structure for configuration, logging, health checks, and example modules.

## Quick start

1. Copy `env.example` to `.env` and update environment variables.
2. Install dependencies: `npm install` (or `pnpm`/`yarn`).
3. Run in development: `npm run start:dev`.

## Extending the boilerplate

- Add new modules under `src/modules/`.
- Implement providers under `src/providers/` and register them in modules.
- Use `src/config/env.config.ts` for typed configuration values.

## Docker

- Build: `docker build -t nestjs-boilerplate .`
- Run: `docker run --env-file .env -p 3000:3000 nestjs-boilerplate`

## CI

- Workflows under `.github/workflows` are placeholders — update secrets
  and job runners to match your org.

## Contributing

Make sure to run lint and tests before opening a PR:

```bash
npm run lint
npm test
```


