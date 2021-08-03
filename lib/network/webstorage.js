/**
 * @description Web storage mxiins
 * @param {any} type type of the storage [local, session]
 * @returns {Object} session manipulations API
 */
const WebStorageMixin = ((type) => {

    let isAvailable = true;
    try {
        type.setItem("caldroJS", "")
    } catch(err) {
        isAvailable = false;
    };

    const storage = {};
    storage.isAvailable = isAvailable;

    storage.add = (name, title) => {
        let value = typeof title === "object" ? JSON.stringify(title) : title;
        type.setItem(String(name), value);
    };

    storage.get = (name) => {
        return type.getItem(name);
    };

    storage.update = (name, title) => {
        let value = typeof title === "object" ? JSON.stringify(title) : title;
        type.setItem(String(name), value);
    };

    storage.delete = (name) => {
        type.removeItem(name);
    };

    storage.clear = () => {
        type.clear();
    };

    return storage;

});

export const LocalStorage = WebStorageMixin(window.localStorage);
export const SessionStorage = WebStorageMixin(window.sessionStorage);