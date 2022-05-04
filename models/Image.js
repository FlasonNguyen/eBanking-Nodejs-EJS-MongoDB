const mongoose = require('mongoose');
const Image = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    frontID: {
        data: Buffer,
        contentType: String,
    },
    backID: {
        data: Buffer,
        contentType: String,
    },
})
module.exports = mongoose.model('Image', Image);