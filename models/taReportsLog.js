const mongoose = require('mongoose');

const taReportsLogSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    doubtsAccepted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doubt'
        }
    ],

    doubtsResolved: {
        type: Number,
        default: 0
    },

    doubtsEscalated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doubt'
        }
    ],

    averageResolvingTime: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true
});

const TaReportsLog = mongoose.model('TaReportsLog', taReportsLogSchema);
module.exports = TaReportsLog;