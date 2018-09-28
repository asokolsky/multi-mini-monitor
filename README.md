# multi-mini-monitor

This is an [electron](https://electronjs.org) application presenting the realtime status of the multiple remote hosts exposed via [systeminformation-api](https://github.com/asokolsky/systeminformation-api) REST services.

# Installing

```bash
# Clone this repository
git clone https://github.com/asokolsky/multi-mini-monitor.git
# Go into the repository
cd multi-mini-monitor
# Install dependencies
npm install
# Run the app
npm start
```

# Debug Trace
The package relies on (almost standard) [debug](https://www.npmjs.com/package/debug) package.  Command line to enable this app trace on Windows (powershell, default in vscode):
```
$env:DEBUG='mmm:*';electron . localhost:3000
```
[More on debug namespace](https://developer.ibm.com/node/2016/10/12/the-node-js-debug-module-advanced-usage)

# TODO

This is a work in progress.

Build works as a VSCode task (using tsc) - just press Ctrl+Shift+B.  

Gulp is still broken.

