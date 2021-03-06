const {dialog, app, Menu, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

const { setup: setupPushReceiver } = require('electron-push-receiver');

const log = require('electron-log');
const { autoUpdater } = require("electron-updater")

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'debug';
log.transports.rendererConsole.level = 'debug';
log.transports.rendererConsole.format = '{level} {text}';
log.info('App starting...');
autoUpdater.checkForUpdates();
setInterval(() => {
  autoUpdater.checkForUpdates();
}, 2 * 60 * 60 * 1000)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: "A new version of DevHub has been downloaded",
    detail: 'Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.

  if(process.env.ENV === 'development')
    win = new BrowserWindow({
      width: 1100,
      height: 750,
      minHeight: 450,
      minWidth: 870,
    })
  else
    win = new BrowserWindow({
      width: 900,
      height: 650,
      minHeight: 450,
      minWidth: 870,
      webPreferences: {
        devTools: false
      }
    })

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Initialize electron-push-receiver component. Should be called before 'did-finish-load'
  setupPushReceiver(win.webContents);

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  var template = [{
    label: "DevHub",
    submenu: [
        { label: "About DevHub", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  
  var handleRedirect = (e, url) => {
    if(url != win.webContents.getURL() && 
       url.indexOf("dev-hub.auth0.com") === -1 && 
       url.indexOf("repo_logs") === -1 &&
       url.indexOf("repo_exec") === -1) {
      e.preventDefault()
      require('electron').shell.openExternal(url)
    }
  }
  
  win.webContents.on('will-navigate', handleRedirect)
  win.webContents.on('new-window', handleRedirect)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
