const mongoose = require('mongoose');
const Visit = require('./visit');

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },    
    phoneNumber: {
        type: Number,
        required: true
    },
    visits: [Visit.schema]  // Embed an array of visits within each visitor
});

module.exports = mongoose.model('Visitor', visitorSchema);
