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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

;
(function (window, Map) {
    let STATUS;
    (function (STATUS) {
        STATUS[STATUS["WAITING"] = 0] = "WAITING";
        STATUS[STATUS["FETCHING"] = 1] = "FETCHING";
        STATUS[STATUS["READY"] = 2] = "READY";
        STATUS[STATUS["SUCCESS"] = 3] = "SUCCESS";
        STATUS[STATUS["ERROR"] = 4] = "ERROR";
    })(STATUS || (STATUS = {}));
    const moduleMap = new Map();
    const taskMap = new Map();
    /**
     * 依赖模块类
     *
     * _id        模块的唯一标识符
     * STATUS     模块当前的加载状态
     * _callback  模块依赖加载成功之后的回调函数
     * _error     模块依赖加载失败的回调函数
     * _deps      模块依赖的数组，标识符为_id
     * _depsCount 当前模块所依赖的模块数
     *
     * @class Module
     */
    class Module {
        constructor(moduleMap, context, task) {
            this._STATUS = STATUS.WAITING;
            this._task = [];
            this._id = moduleMap.size + 1;
            this._context = context;
            this._task.push(task);
        }
        init(name, callback, error, dependents) {
            this.name = name;
            this._callback = callback;
            this._error = error;
            this._depsCount = dependents.length;
            this._deps = dependents;
            this._STATUS = STATUS.WAITING;
        }
        set depsCounts(depsCount) {
            if (depsCount === 0) {
                let deps = [];
                for (let value of this._deps) {
                    deps.push(this._context.moduleMap.get(value));
                }
                this._export = this._callback.apply(this, deps);
                this.callHook(STATUS.READY);
            }
            else {
                this._depsCount = depsCount;
            }
        }
        get depsCounts() {
            return this._depsCount;
        }
        set STATUS(status) {
            if (status === STATUS.SUCCESS || status === STATUS.ERROR) {
                for (let value of this._task) {
                    typeof value === 'string' && this._context.moduleMap.get(value).applyCallback(status);
                    typeof value === 'number' && this._context.taskMap.get(value).applyCallback(status);
                }
            }
            this._STATUS = status;
        }
        get STATUS() {
            return this._STATUS;
        }
        applyCallback(status) {
            console.log('callback');
        }
        callHook(status) {
        }
        getModuleId() {
            return this._id;
        }
    }
    /**
     * require任务类
     * _id            每一个task的唯一标识符
     * _callback      task的成功回调函数
     * _error         task的失败回调函数
     * _deps          task的依赖数组，以Module._id进行标识
     * _depsCount     task的未加载依赖个数
     *
     * @class Task
     */
    class Task {
        constructor(moduleMap, callback, error, dependents, context, taskMap) {
            this._id = taskMap.size + 1;
            this._callback = callback;
            this._error = error;
            this._depsCount = dependents.length;
            this._context = context;
            this._deps = dependents;
        }
        set depsCounts(depsCount) {
            if (depsCount === 0) {
                let deps = [];
                for (let value of this._deps) {
                    deps.push(this._context.moduleMap.get(value));
                }
                this._callback.apply(this, deps);
            }
            else {
                this._depsCount = depsCount;
            }
        }
        get depsCounts() {
            return this._depsCount;
        }
        getTaskId() {
            return this._id;
        }
        exec(moduleMap) {
            const deps = this._deps;
            for (let name of deps) {
                if (moduleMap.has(name)) {
                    this.depsCounts = this.depsCounts - 1;
                }
                else {
                    this.$fetchDeps(name);
                }
            }
        }
        applyCallback(status) {
            console.log('callback');
        }
        $fetchDeps(name) {
            const path = this._context.basePath + name;
            const script = document.createElement('script');
            const body = this._context.bodyDOM;
            const that = this;
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', path);
            script.onerror = function (ev) {
                that._error.call(that, ev.error);
            };
            body.appendChild(script);
            const module = new Module(this._context.moduleMap, this._context, this._id);
            this._context.moduleMap.set(name, module);
            module.callHook(STATUS.FETCHING);
        }
    }
    class Context {
        constructor(dataMain, moduleMap, taskMap) {
            this._fetchError = function (ev) {
                window.console.error(ev.error);
                return ev;
            };
            this.URLReg = /((?:\w*\/)*)((?:\w+).js)/;
            const matchResult = dataMain.match(this.URLReg);
            this.bodyDOM = document.querySelector('body');
            this.taskMap = taskMap;
            this.moduleMap = moduleMap;
            let entryFile;
            if (matchResult) {
                this.basePath = matchResult[1];
                this.entryFile = matchResult[2];
            }
            else {
                throw new URIError('The data-main file\'s URL is an illegal URL.');
            }
            this.$init();
        }
        $init() {
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', this.basePath + this.entryFile);
            script.onerror = this._fetchError;
            this.bodyDOM.appendChild(script);
        }
    }
    const context = (function init(moduleMap, taskMap) {
        const scripts = document.querySelectorAll('script');
        let dataMain = '';
        Array.prototype.forEach.call(scripts, function (value) {
            value.getAttribute('data-main') && (dataMain = value.getAttribute('data-main'));
        });
        return new Context(dataMain, moduleMap, taskMap);
    })(moduleMap, taskMap);
    const require = function (deps, callback, error) {
        const task = new Task(moduleMap, callback, error, deps, context, taskMap);
        taskMap.set(task.getTaskId(), task);
        task.exec(moduleMap);
    };
    const define = function () {
    };
    if (!window.hasOwnProperty('require') && !window.hasOwnProperty('define')) {
        Object.defineProperties(window, {
            require: {
                value: require,
                configurable: false,
                writable: false,
                enumerable: false
            },
            define: {
                value: define,
                configurable: false,
                writable: false,
                enumerable: false
            }
        });
    }
})(window, Map);
//# sourceMappingURL=require.js.map

/***/ })
/******/ ]);