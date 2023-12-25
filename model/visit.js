const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema({
    purposeOfVisit: {
        type: String,
        required: true
    },
    visitTime: {
        type: Date,
        default: Date.now
    }
    // Add more properties for the visit as needed
    // For example: checkInTime, checkOutTime, etc.
}, { timestamps: true });  // Add timestamps to track visit creation and update times

module.exports = mongoose.model('Visit', visitSchema);