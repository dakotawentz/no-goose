const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      // Find all thoughts
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error(`Error in getAllThoughts: ${err.message}`);
      res.status(500).json({ error: 'Failed to fetch thoughts' });
    }
  },
  
  // Get a single thought
  async getThoughtById(req, res) {
    try {
      // Find a single thought by its id
      const thought = await Thought.findById(req.params.thoughtId)
        .select('-__v');

      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      console.error(`Error in getThoughtById: ${err.message}`);
      res.status(500).json({ error: 'Failed to fetch thought' });
    }
  },

  // Create a thought
  async createThought(req, res) {
    try {
      // Create a thought
      const thought = await Thought.create(req.body);

      // Update the user to include the new thought
      const username = await User.findByIdAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.status(201).json(thought);
    } catch (err) {
      console.error(`Error in createThought: ${err.message}`);
      res.status(500).json({ error: 'Failed to create thought' });
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
    try {
      // Delete a thought by its id
      const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      // Update the user to remove the deleted thought
      await User.updateMany(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } }
      );

      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      console.error(`Error in deleteThought: ${err.message}`);
      res.status(500).json({ error: 'Failed to delete thought' });
    }
  },

  // Update a thought
  async updateThought(req, res) {
    try {
      // Update a thought by its id
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { thoughtText },
        { new: true, runValidators: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      res.json(updatedThought);
    } catch (err) {
      console.error(`Error in updateThought: ${err.message}`);
      res.status(500).json({ error: 'Failed to update thought' });
    }
  },

  // Create a reaction for a thought
  async createReaction(req, res) {
    try {
      // Create a reaction for a thought by its id
      const { reactionBody, username } = req.body;
      const newReaction = { reactionBody, username };
      const thought = await Thought.findByIdAndUpdate(
        { _id:req.params.thoughtId },
        { $push: { reactions: newReaction } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      console.error(`Error in createReaction: ${err.message}`);
      res.status(500).json({ error: 'Failed to create reaction' });
    }
  },

  // Delete a reaction from a thought
  async deleteReaction(req, res) {
    try {
      // Delete a reaction from a thought by its id and the reaction id
      const thought = await Thought.findByIdAndUpdate(
        { _id:req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      res.json(thought);
    } catch (err) {
      console.error(`Error in deleteReaction: ${err.message}`);
      res.status(500).json({ error: 'Failed to delete reaction' });
    }
  }
};
