const mongoose = require('mongoose');
const MyObjectId = mongoose.Types.ObjectId;

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    sender: {
        type: MyObjectId
    },
    time: {
        type: Date,
        required: false,
        default: '2002-12-09'

    }
});

const MessageModel = mongoose.model('MessageModel', MessageSchema);

module.exports = MessageModel;