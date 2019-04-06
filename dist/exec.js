/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/renderer/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/renderer/index.ts":
/*!*******************************!*\
  !*** ./src/renderer/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(/*! os */ "os");
const pty = __webpack_require__(/*! node-pty */ "node-pty");
const xterm_1 = __webpack_require__(/*! xterm */ "xterm");
const fit = __webpack_require__(/*! xterm/lib/addons/fit/fit */ "xterm/lib/addons/fit/fit");
const ligatures = __webpack_require__(/*! xterm-addon-ligatures */ "xterm-addon-ligatures");
const _debounce = __webpack_require__(/*! lodash.debounce */ "lodash.debounce");
const remote = __webpack_require__(/*! electron */ "electron").remote;


xterm_1.Terminal.applyAddon(fit);
xterm_1.Terminal.applyAddon(ligatures);
const term = new xterm_1.Terminal({
    fontFamily: 'Fira Code, Iosevka, monospace',
    fontSize: 14,
    experimentalCharAtlas: 'dynamic'
});
const terminalElem = document.getElementById('term-exec');
term.open(terminalElem);
term.enableLigatures();
term.fit();
const ptyProc = pty.spawn(os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/bash', [], {
    cols: term.cols,
    rows: term.rows
});
const fitDebounced = _debounce(() => {
    term.fit();
}, 17);
term.on('data', (data) => {
    ptyProc.write(data);
});
term.on('resize', size => {
    ptyProc.resize(Math.max(size ? size.cols : term.cols, 1), Math.max(size ? size.rows : term.rows, 1));
});

var showUI = false;
ptyProc.on('data', data => {
  if(data.indexOf("@jx-") !== -1)
    showUI = true;
  if((data.indexOf("exit") !== -1 && data.length <= 8) || data.indexOf("# exit") !== -1){
      remote.getCurrentWindow().close();
  }
  if(showUI)
    term.write(data);
});
window.onresize = () => {
    fitDebounced();
};

var appPath = remote.app.getAppPath();

var kubectl = "kubectl.exe"
if(process.platform === "darwin"){
    kubectl = "kubectl-darwin"
}
else if(process.platform === "linux"){
    kubectl = "kubectl-linux"
}

ptyProc.write(`KUBECONFIG=${appPath}/k8s/config ${appPath}/k8s/${kubectl} --namespace __namespace__ --token __token__ exec -it __sample_pod__ bash\n`)
ptyProc.write(`clear\n`)

/***/ }),

/***/ "lodash.debounce":
/*!**********************************!*\
  !*** external "lodash.debounce" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lodash.debounce");

/***/ }),

/***/ "node-pty":
/*!***************************!*\
  !*** external "node-pty" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("node-pty");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "electron":
/*!*********************!*\
  !*** external "electron" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

  module.exports = require("electron");

  /***/ }),

/***/ "xterm":
/*!************************!*\
  !*** external "xterm" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("xterm");

/***/ }),

/***/ "xterm-addon-ligatures":
/*!****************************************!*\
  !*** external "xterm-addon-ligatures" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("xterm-addon-ligatures");

/***/ }),

/***/ "xterm/lib/addons/fit/fit":
/*!*******************************************!*\
  !*** external "xterm/lib/addons/fit/fit" ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("xterm/lib/addons/fit/fit");

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map