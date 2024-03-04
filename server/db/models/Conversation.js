const mongoose = require('mongoose');
const MyObjectId = mongoose.Types.ObjectId;

const ConversationSchema = new mongoose.Schema({
    messages: {
        type: Array,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    lastViewedByMember: {
        type: Object
        
    }
    
});

const ConversationModel = mongoose.model('ConversationModel', ConversationSchema);

module.exports = ConversationModel;