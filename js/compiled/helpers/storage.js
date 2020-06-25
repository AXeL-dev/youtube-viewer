function getFromStorage(...keys) {
    let promises = [];
    keys.forEach((key) => {
        promises.push(__get(key));
    });
    return Promise.all(promises);
}
function __get(key) {
    return new Promise((resolve, reject) => {
        try {
            browser.storage.local.get(key).then((storage) => {
                resolve(storage[key]);
            });
        }
        catch (error) {
            const value = localStorage.getItem(key);
            let finalValue;
            try {
                finalValue = JSON.parse(value);
            }
            catch (error) {
                finalValue = value;
            }
            resolve(finalValue);
        }
    });
}
function saveToStorage(values) {
    let promises = [];
    Object.keys(values).forEach((key) => {
        promises.push(__save(key, values[key]));
    });
    return Promise.all(promises);
}
function __save(key, value) {
    return new Promise((resolve, reject) => {
        try {
            browser.storage.local.set({ [key]: value }).then(() => {
                resolve();
            });
        }
        catch (error) {
            let finalValue;
            try {
                finalValue = JSON.stringify(value);
            }
            catch (error) {
                finalValue = value;
            }
            localStorage.setItem(key, finalValue);
            resolve();
        }
    });
}
