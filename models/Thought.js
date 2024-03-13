const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const reactionSchema = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
    thoughtText: { 
        type: String, 
        required: true, 
        minlength: 1, 
        maxlength: 280 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        get: (createdAt) => dateFormat(createdAt) 
    },
    username: { 
        type: String, 
        required: true 
    },
    reactions: [reactionSchema]
}, 
{ 
    toJSON: { virtuals: true } 
});

// Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema
    .virtual('reactionCount')
    .get(function() {
        return this.reactions.length;
});


function dateFormat(date) {
    // Implement date formatting logic here
    return date.toISOString();
}

// Initialize our Thought model
const Thought = mongoose.model('Thought', thoughtSchema);

// Export the Thought model
module.exports = Thought;
