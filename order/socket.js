const Order = require('./order');
const mongoose = require('mongoose');

let streams = [];

exports.connect = (restaurantId, socketServer) => {
    let found = streams.find(s => s.key == restaurantId);
    if (found) {
        found.connectedUsers++;
        let index = streams.findIndex(s => s.key == restaurantId);
        streams[index] = found;
    } else {
        let pipeline = [
            { $match: { operationType: 'insert' } },
            { $match: { "fullDocument.restaurant": mongoose.Types.ObjectId(restaurantId) } }
        ];

        let changeStream = Order.watch(pipeline).on('change', data => {
            socketServer.to(restaurantId).emit(data.fullDocument.restaurant, data.fullDocument);
        });

        let stream = {
            key: restaurantId,
            connectedUsers: 1,
            stream: changeStream
        };

        streams.push(stream);
    }
}

exports.disconnect = (restaurantId) => {
    let found = streams.find(s => s.key == restaurantId);
    if (found) {
        let index = streams.findIndex(s => s.key == restaurantId);
        if (found.connectedUsers == 1) {
            found.stream.close()
            streams.splice(index, 1);
        } else {
            found.connectedUsers--;
            streams[index] = found;
        }
    }
}