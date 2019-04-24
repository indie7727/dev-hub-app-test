# Dev Hub Electron App
---------

### Install node & npm

`brew install node@8` (tested with 8.15.1)<br>
NPM (tested with npm 6.4.1)

### Install dependencies

`npm install`<br>
`npm install electron@latest`<br>
`npm run electron-rebuild`

### Build app

`npm run build`

### Run app to debug

`npm run watch` - runs webpack/react

And in another terminal window run:

`npm run start` - runs electron

### Package and publish app to s3

`npm run dist`
