# Security Policy

## Supported Versions

Only the latest stable release of this application receives security updates. Please make sure you can reproduce the issue with it before reporting.

## Reporting a Vulnerability

Please do not report vulnerabilities via public issues. Instead, report them privately via [GitHub's private vulnerability reporting](https://github.com/devmount/you-can-quit/security/advisories/new). You will receive a response as soon as possible, and the issue will be disclosed publicly once a fix is released.

This applies to issues like your tracked days leaking outside of your browser, a crafted backup file being able to inject code into the application or store anything other than valid days, or the application sending requests to third parties. Everything else can be filed as a normal bug report.

## FAQ

### 1. Is this application fully contained or does it request any data (like JS packages) from third-party CDN servers?

This application is fully contained. All [dependencies](https://github.com/devmount/you-can-quit/network/dependencies) are retrieved and minified on build. No CDN or other third-party server is contacted at runtime. You can verify that by opening the network tab in the dev tools and using the application.

### 2. Does it collect and sell my data?

No. Your tracked days are stored only in your browser's local database (IndexedDB) and are never synchronized, sent or sold anywhere. There are no accounts and no tracking. Clearing your browser's site data or using the "Clear Database" button in the administration section removes all of it.

### 3. What happens when I export or import a backup?

Exporting creates a JSON file with your tracked days as a download on your device. Importing reads such a file locally, checks that it only contains valid dates and day states, and stores them in your browser's local database. The file is never uploaded anywhere.

### 4. Can I run it without using the hosted version?

Yes. You can build and run the application yourself, see the [developer setup in the README](README.md#become-a-developer).
