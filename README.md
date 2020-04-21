# you-can-quit

[![release](https://img.shields.io/badge/release-v1.0.0-78d19a.svg?style=flat-square)](https://github.com/devmount/you-can-quit/releases) [![downloads](https://img.shields.io/npm/dt/you-can-quit?label=downloads&color=78d19a&style=flat-square)](https://www.npmjs.com/package/you-can-quit) [![last commit](https://img.shields.io/github/last-commit/devmount/you-can-quit?label=updated&color=78d19a&style=flat-square)](https://github.com/devmount/you-can-quit/commits/master) [![license](https://img.shields.io/badge/license-MIT-78d19a.svg?style=flat-square)](./LICENSE) [![contributions welcome](https://img.shields.io/badge/PRs-welcome-78d19a.svg?style=flat-square)](./.github/CONTRIBUTING.md)

A tool to support your progress in quitting whatever your bad habit is. In a simple calendar view, you can mark past days as _successful_ or _failed_. Based on your selection, you can see encouraging stats about the number of days you succeeded in. Plus you can earn special achievements to reach different goals and keep you motivated on your way.

**y**ou-**c**an-**q**uit in short: **YCQ**, which also means (if you pronounce it): You Seek You. This app is about you, making an impact on your own life.

This web app is based on Vue.js and Dexie.js and is _currently in development_.

> ℹ Technical Hint: This app isn't meant to synchronize between devices, since local browser storage (IndexedDB) is used to store your data. However you have the possibility to export your data and import it on another browser or device.

![screenshot](https://user-images.githubusercontent.com/5441654/79687237-20edd300-8246-11ea-87ce-4faee94ef1c2.png)

## Features

- Simple month and year views to see successful and failed days (and possible patterns) at one glance
- Stats section with showing current and longest streak (successful days in a row) and the total number of successful days
- Earn achievements with successful days by reaching various goals
- Supports multiple languages
- Supports shortcuts:
  - <kbd>←</kbd> / <kbd>→</kbd> to go to previous/next month
  - <kbd>CTRL</kbd>+<kbd>←</kbd> / <kbd>CTRL</kbd>+<kbd>→</kbd> to go to previous/next year
  - <kbd>R</kbd> to reset to current month
- Provides administration section to backup, import or clear database
- Made for offline usage - no synchronisation of data around the web

## Get started

1. Get all files

    ```bash
    git clone https://github.com/devmount/you-can-quit
    ```

2. Install all dependencies using [Yarn](https://yarnpkg.com)

    ```bash
    cd you-can-quit
    yarn
    ```

3. Run the app by ...

    ... either run the `you-can-quit/dist/index.html` in your browser, e.g.

    ```bash
    firefox dist/index.html&
    ```

    ... or start the development server with hot reload at localhost:8080

    ```bash
    yarn serve
    ```

    ... or make the production build with minification yourself

    ```bash
    yarn build
    ```

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
    yarn
    ```

3. Run the app (see instructions above in the *Get started* section) and import this data file in the administration section at the bottom.

---

you-can-quit is completely free to use. If you enjoy it, please consider [contributing](.github/CONTRIBUTING.md) or [donating via Paypal](https://paypal.me/devmount) for further development. :green_heart:
