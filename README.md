# Package-Lock NPM Registry Switcher

## Description

This script is a utility to automate the process of switching URLs in your `package-lock.json`. It’s particularly useful for managing and switching between different registry URLs, such as local and remote npm registries.

## Features

- **Configuration-Based:** Easily configure the local and remote URLs in a `pkg.config.js` file.
- **CLI Support:** Execute the script with various options using a command-line interface.
- **Robust Logging:** Detailed logs with timestamps, including info and error messages.

## Usage

1. **Configuration:**
    - Set up your `pkg.config.js` with the local and remote URLs you want to manage. It should be in the same directory as your `package-lock.json`.

    ```javascript
    // pkg.config.js
    export default {
      local: "http://localhost:4873",
      remote: "https://registry.npmjs.org"
    };
    
    ```
   
2. **Running the Script:**
    - Execute the script via the command line, specifying options as needed.
    - Example: `pkglock --local` switch to local NPM registry.
    - Example: `pkglock --remote` switch to remote NPM registry.

3. **Output:**
    - The script will modify the `package-lock.json`, switching URLs as per the configuration.
    - Log output will be generated for insights into the script’s execution and any potential issues.


## Logging

Log outputs are stored in `pkg-lock.log` and include detailed information and timestamps. So you are able to see what happened and when. You should check the .gitgnore and make sure the log file is not being tracked by git.


## Speeding Up NPM with Verdaccio

[Verdaccio](https://verdaccio.org/) is a lightweight, open-source private npm proxy registry that is highly beneficial in improving the efficiency and speed of your npm installations.

### Why Use Verdaccio?

- **Caching:** Verdaccio caches npm packages locally, reducing the need to fetch from the npm registry repeatedly. This feature is particularly beneficial in speeding up installations in a CI/CD environment.

- **Private Packages:** Verdaccio allows you to have private packages without the need to pay for a private npm subscription. You can host and manage your packages privately and securely.

- **Offline Access:** With Verdaccio, you can access your cached packages even when you are offline, increasing resilience and reducing downtime due to network issues.

### Integration with This Script

Our script, which automates the process of switching URLs in your `package-lock.json` file, works harmoniously with Verdaccio. You can easily switch between your local Verdaccio registry and a remote npm registry by configuring the URLs in the `pkg.config.js` file.

By doing this, you can enjoy faster npm installations with the local caching provided by Verdaccio, and seamlessly switch to the remote registry as needed, all managed efficiently through our script.

## License

MIT License
