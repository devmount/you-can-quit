# you-can-quit

[![release](https://img.shields.io/github/v/tag/devmount/you-can-quit.svg?label=release&color=78d19a&style=flat-square)](https://github.com/devmount/you-can-quit/releases)
[![last commit](https://img.shields.io/github/last-commit/devmount/you-can-quit?label=updated&color=78d19a&style=flat-square)](https://github.com/devmount/you-can-quit/commits/main)
[![license](https://img.shields.io/badge/license-MIT-78d19a.svg?style=flat-square)](./LICENSE.md)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-78d19a.svg?style=flat-square)](./.github/CONTRIBUTING.md)

This app is a tool to track your progress and encourage you on the way of quitting a bad habit. In a simple calendar view, you can set past days _successful_ or _failed_. Based on this data, you can see encouraging stats about the number of days you succeeded in. Plus you can earn special achievements to reach different goals and keep you motivated on your way.

**you**-**c**an-**q**uit in short: **UCQ**, which also means (if you pronounce it): You Seek You. It's about you, making an impact on your own life.

This web app is based on Vue.js and Dexie.js.

> [!IMPORTANT]
> This app values privacy. The data isn't meant to be synchronized between different devices, therefore local browser storage (IndexedDB) is used to store your data. However you have the possibility to export your data and import it on another browser or device.

![screenshot](https://user-images.githubusercontent.com/5441654/79687237-20edd300-8246-11ea-87ce-4faee94ef1c2.png)

## Features

- 📅 Simple month and year views to see successful and failed days (and possible patterns) at one glance
- 📈 Stats section showing current and longest streak (successful days in a row) and the total number of successful days
- 🏆 Earn encouraging and funny achievements by reaching various goals, see progress of each achievement
- 🌐 UI supports multiple languages (currently only English and German)
- ⌨ Navigation with shortcuts:
  - <kbd>←</kbd> / <kbd>→</kbd> to go to previous/next month
  - <kbd>CTRL</kbd>+<kbd>←</kbd> / <kbd>CTRL</kbd>+<kbd>→</kbd> to go to previous/next year
  - <kbd>R</kbd> to reset to current month
- 💾 Provides administration section to backup, import or clear database
- ⚡ Made for offline usage, the data is stored only in your local browsers
- 🔒 Values privacy - no synchronisation of data around the web

## Get started

Just head over to <https://youcanqu.it> and start your journey.

## Become a developer

Here is how you can set up a local development environment. This project requires [Node.js](https://nodejs.org/) 24 or newer and uses [pnpm](https://pnpm.io/installation#using-npm) as package manager.

1. [Clone](https://help.github.com/en/articles/cloning-a-repository) this project with Git
2. Install dependencies by running `pnpm install` within the cloned directory `you-can-quit/`
3. Run `pnpm dev` to start the development server with hot reload at <http://localhost:5173>

Run `pnpm build` to create a production build in the `dist/` directory and `pnpm serve` to preview it locally. To run a specific version, check out its tag from the [releases page](https://github.com/devmount/you-can-quit/releases).

Before creating a pull request, run `pnpm lint` and `pnpm test` to make sure everything passes. Please read the [contribution guidelines](.github/CONTRIBUTING.md) first.

## Upgrade from 0.x to 1.x

The breaking change in version 1.x is, that the database was switched from Firebase to IndexedDB. This means, it's no longer compatible with your current data. If you rather want to migrate your data instead of starting from scratch (depends on how much days you already used this app), you can do the following:

1. Export your Firebase data into a local `.json` file in the following format:

    ```json
    {
      "2019-02-02": 1,
      "2019-07-25": -1,
      "2019-01-10": -1,
      "2019-11-09": 1
    }
    ```

    The order of dates doesn't matter. If you have any problems to do so, please [create an issue](https://github.com/devmount/you-can-quit/issues/new?template=bug_report.md).

2. Update app files and dependencies

    ```bash
    cd you-can-quit
    git pull
    pnpm install
    ```

3. Run the app (see instructions above in the _Become a developer_ section) and import this data file in the administration section at the bottom.

---

you-can-quit is completely free to use. If you enjoy it, please consider [contributing](.github/CONTRIBUTING.md), [donating via Paypal](https://paypal.me/devmount) or [become a sponsor](https://github.com/sponsors/devmount/) for further development. :green_heart:
