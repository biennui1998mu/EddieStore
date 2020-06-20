const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    gmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    dob: {
        type: Date,
    },
    name: {
        type: String,
        required: true
    },
    tel: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('userSchema', User);