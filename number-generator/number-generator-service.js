const Numb = require('./number');
const mongoose = require('mongoose');

exports.getNumber = (restaurantId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let searchDTO = { restaurant: restaurantId };

            let number = await Numb.findOne(searchDTO);

            if (number == null) {
                number = await createNumber(restaurantId);

                return resolve(number);
            }

            let shouldReset = await shouldResetNumber(number);
            if (shouldReset) {
                number = resetNumber(restaurantId);
                
                return resolve(number);
            }

            number = await incrementNumber(restaurantId);
            
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

function resetNumber(restaurantId) {
    return new Promise(async (resolve, reject) => {
        try {
            let number = await Numb.findOne({ restaurant: restaurantId });
            number.number = 1;
            number.date = new Date();
            await number.save();

            resolve(number);
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

function incrementNumber(restaurantId) {
    return new Promise(async (resolve, reject) => {
        try {
            let numb = await Numb.findOne({ restaurant: restaurantId });
            numb.number += 1;

            numb = await numb.save();

            resolve(numb);
        } catch (error) {
            reject(error);
        }
    });
}