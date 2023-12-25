const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Visitor = require('./visitor');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        min: 5
    },
    email:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        enum: ['host','admin']
    },
    visitors: [Visitor.schema]  // Embed an array of visitors within each host
});

// Define a pre-save hook to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password') || this.isNew) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});
module.exports = mongoose.model('User', userSchema);

