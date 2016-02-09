'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('underscore');
_.mixin(require('underscore.deep'));

module.exports = {
    flatten: function flatten(obj) {
        return _.deepToFlat(obj);
    },
    deepen: function deepen(obj) {
        return _.deepFromFlat(obj);
    },
    subscribe: function subscribe(key, callback) {
        var keys = key.split('.'),
            baseKey = keys.shift(),
            obj = this.getOrCreate(baseKey);

        obj.meta.event = 'localstorage/change/' + baseKey;
        localStorage.setItem(baseKey, (0, _stringify2.default)(obj));
        $(document).on(obj.meta.event, callback);
    },
    sendEvent: function sendEvent(obj) {
        if (typeof obj.meta.event === 'undefined') {
            return;
        }
        $(document).trigger(obj.meta.event, obj);
    },
    beforeSet: function beforeSet(value) {
        var obj = _.deepExtend({
            meta: {
                created_at: Date.now(),
                type: (0, _typeof3.default)(value.data)
            }
        }, value);

        obj.meta.updated_at = Date.now();
        return (0, _stringify2.default)(obj);
    },
    afterSet: function afterSet(obj) {
        this.sendEvent(obj);
    },
    setKey: function setKey(object, key, value) {
        var obj = this.flatten(object);
        obj[key] = value;
        return this.deepen(obj);
    },
    set: function set(key, value) {
        var keys = key.split('.'),
            baseKey = keys.shift(),
            obj = this.getOrCreate(baseKey);

        obj.data = keys.length ? this.setKey(obj.data, keys.join('.'), value) : value;
        localStorage.setItem(baseKey, this.beforeSet(obj));
        this.afterSet(obj);
    },
    extend: function extend(key, obj) {
        this.set(key, _.extend(this.get(key), obj));
    },
    touch: function touch(key) {
        var keys = key.split('.'),
            baseKey = keys.shift(),
            obj = this.getOrCreate(baseKey);

        this.set(baseKey, obj.data);
    },
    exists: function exists(key) {
        var value = localStorage.getItem(key);

        if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
            return false;
        }

        return true;
    },
    itterate: function itterate(callback) {
        var keys = (0, _keys2.default)(localStorage);
        var i = keys.length;

        while (i--) {
            callback(keys[i]);
        }
    },
    drilldown: function drilldown(obj, str) {
        return str.split(".").reduce(function (o, x) {
            return o[x];
        }, obj);
    },
    get: function get(key) {
        var meta = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        var keys = key.split("."),
            value = JSON.parse(localStorage.getItem(keys.shift()));

        if (!value) {
            return {};
        }

        if (keys.length) {
            value.data = this.drilldown(value.data, keys.join('.'));
        }

        if (meta) {
            return value;
        }

        return value.data;
    },
    getOrCreate: function getOrCreate(key) {
        if (this.exists(key)) {
            return this.get(key, true);
        }

        return {
            data: {},
            meta: {}
        };
    },
    getMeta: function getMeta(key) {
        var keys = key.split(".");
        var value = localStorage.getItem(keys.shift());
        value = JSON.parse(value);

        return value.meta;
    },
    getAll: function getAll() {
        var _this = this;

        var storage = {};

        this.itterate(function (key) {
            storage[key] = _this.get(key);
        });

        return storage;
    },
    delete: function _delete(key) {
        localStorage.removeItem(key);
    },
    deleteAll: function deleteAll() {
        var _this2 = this;

        this.itterate(function (key) {
            _this2.delete(key);
        });
    },
    sync: function sync() {},
    push: function push() {}
};