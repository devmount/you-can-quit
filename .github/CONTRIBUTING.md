# Contributing to this project

First off, thanks for taking the time to contribute! You are awesome! :tada::clap: Please read the following guidelines if you are planning to contribute to this project and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [General Guidelines](#general-guidelines)
- [How to contribute](#how-to-contribute)
  - [Asking Questions](#asking-questions)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Provide Code via Pull Requests](#provide-code-via-pull-requests)
    - [Coding Style](#coding-style)
    - [Git Commit Messages](#git-commit-messages)
  - [Providing Translations](#providing-translations)
  - [Adding Achievements](#adding-achievements)

## General Guidelines

These guidelines apply to every kind of contribution, be it code, documentation, translations or anything else.

1. **You are responsible for what you submit.** No matter which tools you used, you must understand your submission and be able to explain it, at least at a high level, without the use of AI.
2. **Talk to the maintainer first.** Discuss your plans in a new or existing issue and wait for the maintainer to agree on a solution before you start working. Pull requests without a previously discussed issue will be closed.
3. **Avoid comprehension debt.** Follow the established architecture, formatting and code organization, and use the existing languages, frameworks and libraries. Ask before rewriting existing work or adding new dependencies. The maintainer has the final word on these.
4. **Keep your changeset small and focused.** Every change should directly address the issue being solved, so don't include unrelated refactoring or drive-by "improvements". Aim for less than 500 lines across as few files as possible to keep it reviewable.
5. **Expect your level of effort to be mirrored.** If an agent wrote your patch in 5 minutes, don't expect a human to spend hours reviewing it. If an LLM was used, please disclose how much was LLM generated and what was manual work.
6. **Include tests and relevant documentation.** If the affected area has no tests, propose adding them.
7. **Explain your changes.** Briefly describe your understanding of the problem and your approach in the pull request or the related issue. This makes reviewing a lot easier.

## How to contribute

### Asking Questions

Please don't use issues for questions. Ask them in [the discussions](https://github.com/devmount/you-can-quit/discussions) instead, where the community can help as well.

### Reporting Bugs

Before creating bug reports, please make sure there isn't already [an existing issue](https://github.com/devmount/you-can-quit/issues?q=state%3Aopen%20label%3A%22bug%22) describing your problem. Create the new issue and provide the necessary information by filling in [the bug-report template](https://github.com/devmount/you-can-quit/issues/new?template=bug_report.md).

### Suggesting Enhancements

Enhancement suggestions are also tracked as [GitHub issues](https://github.com/devmount/you-can-quit/issues). Before creating enhancement suggestions, please check [the existing issues](https://github.com/devmount/you-can-quit/issues?q=state%3Aopen%20label%3A%22enhancement%22) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please include as many details as possible. Fill in [the feature-request template](https://github.com/devmount/you-can-quit/issues/new?template=feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

### Provide Code via Pull Requests

To set up a local development environment, follow the steps [in the README](../README.md#become-a-developer). Make sure your pull request follows the [general guidelines](#general-guidelines) above and fill in [the required template](PULL_REQUEST_TEMPLATE.md). Every pull request must reference the issue it was discussed in. Please do not include issue numbers in the PR title, but add it in the PR body via "Closes #1234".

All code must pass the validation workflow automatically running when pushing to a PR. All tests must pass to protect against regressions.

Always run `pnpm lint` and `pnpm test` before pushing to this repo. Please fix all lint warnings.

#### Coding Style

The linter covers some of the code styling automatically. Other than that

- Use the Composition API with `<script setup>`
- Indent with 2 spaces
- Custom components follow the PascalCase when importing and dash-case when adding them to the markup.
- Use destructuring where reasonable
- Favor template literals over string concatenation where applicable
- Modularize code where reasonable

#### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Start your commit messages with one of the following emojis:
  - ➕ when adding a file or implementing a feature
  - 🔨 when fixing a bug or issue
  - ⚡ when improving performance
  - 📜 when updating docs or readme
  - 🌐 when updating translations
  - 🔑 when dealing with security
  - 🧹 when refactoring or improving code
  - ❌ when removing code or files
  - 📦 when updating dependencies
  - ✅ when releasing a new version

### Providing Translations

You can add a new translation or improve an existing one by taking the following steps:

1. Go to the [locales](/src/locales/) directory, which contains a JSON file for each language
2. To improve an existing translation, edit the file of that language. To add a new language, copy the file `src/locales/en.json` and name it like its language code (e.g. `de.json` or `pt-br.json`).
3. Translate only the values and leave the keys untouched. The `icon` keys don't need a translation, just leave them as they are.
4. For a new language, import your file in `src/main.js` and add it to the `messages` object under `// Vue i18n`. Then add the language name to the `languages` object in `src/utils.js`, so it can be selected in the app.
5. Create a Pull Request.

If you run into any problems, leave [an issue](https://github.com/devmount/you-can-quit/issues/) or start [a discussion thread](https://github.com/devmount/you-can-quit/discussions).

### Adding Achievements

Achievements are meant to keep the user motivated. It is really important that an achievement motivates success and makes somehow sense (good example: "10 successful days in a row", bad example: "alternating successful and failed days for 10 days").

You can propose a new achievement by [suggesting an enhancement](#suggesting-enhancements) with the following information:

- Key: one word that is unique among all achievements
- Title: a catching, funny heading for the achievement
- Description: an explanation how to get the achievement
- Icon: a [free FontAwesome icon](https://fontawesome.com/search?ic=free-collection). Simply use its name (e.g. address-book).

To implement an achievement, you have to touch the following files:

- `src/achievements.js`:
  - Add your key to the `achievements` list
  - Implement your status function (e.g. `achievedTen`). It receives the status data and always returns the following object:

    ```javascript
    {
      // integer (how often the achievement was received, e.g. 2)
      state: count,
      // float (percentage how much progress till next achievement, e.g. 30.0)
      progress: progress,
      // integer (how many units left till next achievement, e.g. 5)
      left: left,
      // string (translation key of the unit, e.g. 'day' or 'monday')
      unit: 'day'
    }
    ```

  - Add your key and status function to the `achievementFns` object
- `src/main.js`: import your icon in camelCase style (e.g. `faAddressBook`) and add it to `library.add()`
- `src/locales/en.json`: add your key to the `achievements` object and provide title, description and icon
- `tests/achievements.spec.js`: add tests for your status function and update the expected number of achievements, also in `tests/components/info/AchievementList.spec.js`

Thanks a lot for your support 💚
