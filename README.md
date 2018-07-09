# you-can-quit

A tool to track your habits and support your progress in quitting whatever your vice is.

This web app is based on Vue.js and Firebase/Firestore and is _currently in development_.

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

3. Create an empty file called `config.js` in `you-can-quit/src`
4. Log in to your [Firebase account](https://console.firebase.google.com) and hit the "Create new project" button
5. Enter your new project and click "Add Firebase to your web app"
6. Copy the following code into your just created `config.js`. Replace the values with those of your Firebase project

    ```javascript
    export const config = {
      apiKey: "<your-api-key>",
      authDomain: "<your-auth-domain>",
      databaseURL: "<your-database-url>",
      projectId: "<your-project-id>",
      storageBucket: "<your-storage-bucket>",
      messagingSenderId: "<your-messaging-sender-id>"
    }
    ```

7. Either start the development server ...

    ```bash
    yarn serve
    ```

8. ... or build production

    ```bash
    yarn build
    ```