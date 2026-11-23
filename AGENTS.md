# AGENTS.md

Instructions for AI coding agents working on this repository. Human contributors, please read the [contribution guidelines](.github/CONTRIBUTING.md), which also apply to agents.

## Project

You Can Quit! is a web app to track progress in quitting a bad habit, built with Vue 3, Vite, Dexie (IndexedDB) and vue-i18n. All data stays in the browser's local database, the app never sends requests to any server.

- `src/` contains the root component `App.vue`, the app setup `main.js` (icons, i18n), the achievement logic `achievements.js`, helpers in `utils.js` and the database definition `database.js`
- `src/components/` contains the feature components, `src/components/info/` the stats, achievements and legend components
- `src/locales/<code>.json` contains the translations
- `tests/` contains the Vitest tests, mirroring the structure of `src/`, with shared helpers in `tests/helpers/`

## Commands

- `pnpm install` to install dependencies
- `pnpm dev` to start the development server with hot reload, `pnpm build` to create a production build in `dist/`, `pnpm serve` to preview it
- `pnpm lint` to lint (fix all warnings, CI treats them as errors)
- `pnpm test` to run the tests, `pnpm coverage` to include a coverage report

Run `pnpm lint` and `pnpm test` before considering a change done.

## Conventions

- Keep changes small and focused on the issue, no unrelated refactoring or drive-by "improvements"
- Follow the existing architecture and code style, don't add dependencies without asking the maintainer
- Use the Composition API with `<script setup>`, PascalCase for component imports and dash-case in templates
- Use 2 spaces for indentation, `const` over `let`, destructuring and template literals where reasonable
- Keep comments short, starting with a capital letter, breaking only at 120 characters
- Add or extend tests in `tests/` for new or changed logic
- Add new translation keys to `src/locales/en.json`, other languages are updated by translators
- When adding a language, register it in `src/main.js` and `src/utils.js`, when adding an achievement, follow the steps in the [contribution guidelines](.github/CONTRIBUTING.md#adding-achievements)
- Never add network requests or external resources, all data must stay in the browser

## Commits and pull requests

Start commit messages with one of the emojis listed in the [contribution guidelines](.github/CONTRIBUTING.md#git-commit-messages), use the imperative mood and limit the first line to 72 characters. Pull requests must reference a previously discussed issue and fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md), including the disclosure of how much was AI generated.
