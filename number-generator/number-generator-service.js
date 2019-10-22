const Number = require('./number');

exports.getNumber = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let number = await Number.findById(id);
            if (number == null) {
                number = await createNumber();
            }
            
            let shouldReset = await shouldResetNumber(id);
            if (shouldReset)
                resetNumber(id);


            resolve(number.number);
        } catch (error) {
            reject(error);
        }
    });
}

function createNumber(restaurantId) {
    return new Promise(async (resolve, reject) => {
        try {
            let numberDTO = { number: 1, date: new Date(), restaurant: restaurantId };
            let number = await Number.create(numberDTO);

            resolve(number);
        } catch (error) {
            reject(error);
        }
    });
}

function resetNumber(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let number = await Number.findById(id);
            number.number = 1;
            await number.save();

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function shouldResetNumber(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let number = await Number.findById(id);
            if (number.date.getDate() !== new Date().getDate()) {
                resolve(true);
            }

            resolve(false);
        } catch (error) {
            reject(error);
        }
    });
}