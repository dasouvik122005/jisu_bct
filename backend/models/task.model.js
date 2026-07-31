const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the task'],
    },
    description: {
        type: String,
        default: '',
    },
    subtasks: [{
        title: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }],
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    category: {
        type: String,
        default: 'General',
    },
    dueDate: {
        type: Date,
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
