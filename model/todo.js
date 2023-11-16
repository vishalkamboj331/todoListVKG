// create model with mongoose?
const mongoose = require('mongoose');

const { Schema } = mongoose;

const todoSchema = new Schema({
    item: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'inprogress'],
            message: 'Todo item status can only be one of these: pending, completed, inprogress'
        },
        default: "pending"
    }
},{
    timestamps :true
});

module.exports = mongoose.model('Todo', todoSchema);
