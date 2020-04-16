# you-can-quit

[![license](https://img.shields.io/badge/license-MIT-78d19a.svg?style=flat-square)](./LICENSE.md) [![release](https://img.shields.io/badge/release-v0.2.0-78d19a.svg?style=flat-square)](https://github.com/devmount/you-can-quit/releases) [![size](https://img.shields.io/badge/size-500%20KB-78d19a.svg?style=flat-square)](https://github.com/devmount/you-can-quit) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-78d19a.svg?style=flat-square)](.github/CONTRIBUTING.md)

A tool to support your progress in quitting whatever your bad habit is. In a simple calendar view, you can mark past days as _successful_ or _failed_. Based on your selection, you can see encouraging stats about the number of days you succeeded. Plus you can earn special achievements to reach different goals and keep you motivated on your way.

This web app is based on Vue.js and Dexie.js and is _currently in development_.

![screenshot](https://user-images.githubusercontent.com/5441654/45680370-11267e00-bb3b-11e8-86f9-1f6d10336096.png)

## Features

- Simple month and year views to see successful and failed days (and possible patterns) at one glance
- Stats section with showing current and longest streak (successful days in a row) and the total number of successful days
- Earn achievements with successful days by reaching various goals
- Supports multiple languages
- Supports shortcuts (<kbd>←</kbd> and <kbd>→</kbd> to go to previous/next month, <kbd>R</kbd> to reset to current month)

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

3. Either start the development server with hot reload at localhost:8080 ...

    ```bash
    yarn serve
    ```

4. ... or create a production build with minification

    ```bash
    yarn build
    ```

---

you-can-quit is completely free to use. If you enjoy it, please consider [contributing](.github/CONTRIBUTING.md) or [donating via Paypal](https://paypal.me/devmount) for further development. :green_heart:
