# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

### Dev overrides

In `yarn dev`, a **Dev overrides** button sits in the bottom-right corner (the "Dev Mode" chip in the app bar opens it too).
It lets you fake, without a backend:

- signed in / signed out, plus the user id, email and avatar
- grants (`ad_free`, `plan`, `private_skins`, ...), with presets for free, Plus and Pro
- feature flags, on/off and their values

Overrides are saved in localStorage and only apply when `runtimeConfig.public.isDev` is set.
Fake sign-in only changes the UI. API requests still use your real session, so pages that load account data (My Skins, collections, export) stay empty.

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
