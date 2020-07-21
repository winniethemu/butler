# Butler

Butler is a Google Chrome extension that helps you manage your tabs by grouping them into sessions. Think of it as "tmux for browser tabs". It lets you

- Create a session with currently open tabs
- Restore a previously saved session
- Switch between different sessions with ease

With Butler, you no longer need to painfully navigate through or keep track of the dozens of tabs cluttering up your browser.

![Screenshot](https://raw.github.com/yemutex/butler/master/screenshot.png)

## Installation

### Chrome Web Store

[Link to Chrome Web Store](https://chrome.google.com/webstore/detail/butler/jfkbmadiafhgadcbecimbembmegnojbo)

### Manual Install

Under project root, start by installing the third-party dependencies

```
npm install
```

Then, run the build script

```
./build.sh prod
```

Load the resulting `dist` folder in `chrome://extensions` to see a local build running inside your Chrome.

## License

MIT. [@yemutex](https://twitter.com/yemutex)
