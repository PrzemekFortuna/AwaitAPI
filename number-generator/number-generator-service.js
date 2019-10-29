const Numb = require('./number');
const mongoose = require('mongoose');

exports.getNumber = (restaurantId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let searchDTO = { restaurant: mongoose.Schema.Types.ObjectId.fromString(id) };
            
            let number = await Numb.findOne(searchDTO);

            if (number == null) {
                number = await createNumber();
                return resolve(number);
            }

            let shouldReset = await shouldResetNumber(number);
            if (shouldReset) {
                resetNumber(restaurantId);
                number.number = 2;
                await number.save();
                return resolve(1);
            }

            await incrementNumber(restaurantId);
            return resolve(number);
        } catch (error) {
            reject(error);
        }
    });
}

function createNumber(restaurantId) {
    return new Promise(async (resolve, reject) => {
        try {
            let numberDTO = { number: 1, date: new Date(), restaurant: restaurantId };
            let number = await Numb.create(numberDTO);

            resolve(number);
        } catch (error) {
            reject(error);
        }
    });
}

function resetNumber(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let number = await Numb.findById(id);
            number.number = 1;
            number.date = new Date();
            await number.save();

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function shouldResetNumber(number) {
    return new Promise(async (resolve, reject) => {
        try {
            if (number.date.getDate() !== new Date().getDate()) {
                resolve(true);
            }

            resolve(false);
        } catch (error) {
            reject(error);
        }
    });
}

function incrementNumber(id) {
    return new Promise(async (resolve, reject) => {
        try {
            
        } catch (error) {

        }
    });
}