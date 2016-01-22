const _ = require('underscore')
_.mixin(require('underscore.deep'))

export default {
    flatten(obj) {
        return _.deepToFlat(obj);
    },
    deepen(obj) {
        return _.deepFromFlat(obj);
    },

    subscribe(key, callback) {
        const keys = key.split('.'),
            baseKey = keys.shift(),
            obj = this.getOrCreate(baseKey);

        obj.meta.event = `localstorage/change/${baseKey}`;
        localStorage.setItem(baseKey, JSON.stringify(obj));
        $(document).on(obj.meta.event, callback);
    },
    sendEvent(obj) {
        if (typeof obj.meta.event === 'undefined') {
            return;
        }
        $(document).trigger(obj.meta.event, obj);
    },

    beforeSet(value) {
        const obj = _.deepExtend({
            meta: {
                created_at: Date.now(),
                type: typeof value.data,
            },
        }, value);

        obj.meta.updated_at = Date.now();
        return JSON.stringify(obj);
    },

    afterSet(obj) {
        this.sendEvent(obj);
    },

    setKey(object, key, value) {
        const obj = this.flatten(object);
        obj[key] = value;
        return this.deepen(obj);
    },

    set(key, value) {
        const keys = key.split('.'),
            baseKey = keys.shift(),
            obj = this.getOrCreate(baseKey);

        obj.data = keys.length ? this.setKey(obj.data, keys.join('.'), value) : value;
        localStorage.setItem(baseKey, this.beforeSet(obj));
        this.afterSet(obj);
    },

    touch(key) {
        const keys = key.split('.'),
            baseKey = keys.shift(),
            obj = this.getOrCreate(baseKey);

        this.set(baseKey, obj.data);
    },

    exists(key) {
        const value = localStorage.getItem(key);

        if (typeof value === 'object') {
            return false;
        }

        return true;
    },

    itterate(callback) {
        const keys = Object.keys(localStorage);
        let i = keys.length;

        while ( i-- ) {
            callback(keys[i]);
        }
    },

    drilldown(obj, str) {
        return str.split(".").reduce((o, x) => o[x], obj);
    },

    get(key, meta = false) {
        const keys = key.split("."),
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

    getOrCreate(key) {
        if (this.exists(key)) {
            return this.get(key, true);
        }

        return {
            data:{},
            meta:{},
        };
    },

    getMeta(key) {
        const keys = key.split(".");
        let value = localStorage.getItem(keys.shift());
        value = JSON.parse(value);

        return value.meta;
    },

    getAll() {
        const storage = {};

        this.itterate((key) => {
            storage[key] = this.get(key);
        });

        return storage;
    },

    delete(key) {
        localStorage.removeItem(key);
    },

    deleteAll() {
        this.itterate((key) => {
            this.delete(key);
        });
    },

    sync() {

    },

    push() {

    },
}

