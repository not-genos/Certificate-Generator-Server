const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    certificates: [
        {
            printed_name: {
                type: String,
            },
            course: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            certificateId: {
                type: String,
                required: true,
            },
            link: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model('Student', StudentSchema);