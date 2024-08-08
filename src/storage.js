export class Storage {
    static addToStorage(key, value) {
        let storage = localStorage.setItem(key, JSON.stringify(value));
        return storage;
    }

    static getStorage() {
        let storage = localStorage.getItem(key) === null ? [] : JSON.parse(localStorage.getItem(key));
        return storage;
    }
}