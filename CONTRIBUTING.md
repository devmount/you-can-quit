# Contributing to this project

First off, thanks for taking the time to contribute! You are awesome! :tada::clap:

## Table Of Contents

- [How to contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Adding Translations](#adding-translations)  
- [Adding Achievements](#adding-achievements)
  
## How to contribute

### Reporting Bugs

Before creating bug reports, please make sure there isn't already an existing issue describing your problem, for bugs are tracked as [GitHub issues](https://github.com/devmount/you-can-quit/issues). Simply create an issue and provide the necessary information by filling in [the template](https://github.com/devmount/you-can-quit/issues/new?template=bug_report.md).

### Suggesting Enhancements

Enhancement suggestions are also tracked as [GitHub issues](https://github.com/devmount/you-can-quit/issues). Before creating enhancement suggestions, please check the existing issues as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please include as many details as possible. Fill in [the template](ISSUE_TEMPLATE.md), including the steps that you imagine you would take if the feature you're requesting existed.

### Pull Requests

Simply fill in [the required template](PULL_REQUEST_TEMPLATE.md). Please do not include issue numbers in the PR title.

#### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Consider starting your commit messages with one of the following emojis:
  - :heavy_plus_sign: `:heavy_plus_sign:` when adding/implementing a feature or file
  - :hammer: `:hammer:` when fixing a bug or issue
  - :green_heart: `:green_heart:` when improving code, comments or docs
  - :key: `:key:` when dealing with security
  - :repeat: `:repeat:` when updating dependencies or data
  - :shirt: `:shirt:` when removing linter warnings
  - :x: `:x:` when removing code or files

## Adding Translations

You can add a new translation or improve an existing translation in the `src/locales` directory. Locales data is stored in JSON files that have the two character language abbreviation as filenames, i.e. `en.json` for English. The English language file serves as template for other languages. You can simply copy this file, translate all values by keeping the keys as they are and create a pull request. Please pay attention to the `icon` keys that don't need a translation (just leave them as they are).

Finally you can add your new language file in the `src/main.js` to the `messages` object under `// Vue i18n`.

## Adding Achievements

Achievements are meant to keep the user motivated. It is really important that an achievement motivates success and makes somehow sense (good example: "more than 10 successful days in a row", bad example: "alternating successful and failed days for 10 days").

You can propose a new achievements by providing the following information:

- Key: one word that is unique among all achievements
- Title: a catching, funny heading for the achievement
- Description: an explanation how to get the achievement
- Icon: a [free FontAwesome icon](https://fontawesome.com/icons?d=gallery&m=free). Simply use its name (i.e. address-book).

To implement an achievement, you have to touch the following files:

- `src/main.js`: add your icon in camelCase style to both icon lists
- `src/locales/en.json`: add your achievement key to the achievements list and provide title, description and icon
- `src/components/info/Achievements.vue`:
  - Add your key to the keys list in the `data()` Object
  - Add your key and the corresponding status function to the `getAchievementStatus ()` function
  - Implement your status function under `computed`. It always returns an integer (how often the achievement was reached).
