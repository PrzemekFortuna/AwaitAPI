const Location = require('./location');

exports.addLocation = (location) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newLocation = await Location.create(location);
            resolve(newLocation);
        } catch(error) {
            reject(error);
        }
    });
}