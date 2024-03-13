const { User, Thought } = require('../models');

// Aggregate function to get the number of users overall
const headCount = async () => {
  try {
    const numberOfUsers = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
        },
      },
    ]);

    // If no users are found, throw an error
    if (numberOfUsers.length === 0) {
      throw new Error('No users found');
    }
    
    // Return the total number of users
    return numberOfUsers[0].totalUsers; 
  } catch (error) {
    throw new Error(`Failed to fetch user count: ${error.message}`);
  }
};


const averageThoughtLength = async () => {
  try {
    // Aggregate function to get the average thought length
    const averageThought = await Thought.aggregate([
      {
        $group: {
          _id: null,
          averageThoughtLength: { $avg: { $strLenCP: '$thoughtText' } },
        },
      },
    ]);
    // If no thoughts are found, throw an error
    if (averageThought.length === 0) {
      throw new Error('No thoughts found');
    }

    // Return the average thought length
    return averageThought[0].averageThoughtLength; 
  } catch (error) {
    throw new Error(`Failed to calculate average thought length: ${error.message}`);
  }
};

module.exports = {
  async getAllUsers(req, res) {
    try {
      // Find all users
      const users = await User.find();
      const userObj = {
        users,
        headCount: await headCount(),
      };
      return res.json(userObj);
    } catch (err) {
      // If an error occurs, return a 500 error
      console.error(`Error in getAllUsers: ${err.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  async getUserById(req, res) {
    try {
      // Find a single user by their id
      const user = await User.findById(req.params.userId)
        .select('-__v')
        .lean();

      // If no user is found, return a 404 error
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the user
      res.json({
        user,
        averageThoughtLength: await averageThoughtLength(),
      });
    } catch (err) {
      console.error(`Error in getUserById: ${err.message}`);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  

  async createUser(req, res) {
    try {
      // Create a new user
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      console.error(`Error in createUser: ${err.message}`);
      res.status(500).json({ error: 'Failed to create user' });
    }
  },
  
  async deleteUser(req, res) {
    try {
      // Delete a user by their id
      const user = await User.findByIdAndRemove(req.params.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete all thoughts associated with the user
      await Thought.deleteMany({ username: user.username });

      res.json({ message: 'User successfully deleted along with their thoughts' });
    } catch (err) {
      console.error(`Error in deleteUser: ${err.message}`);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },
  
  async updateUser(req, res) {
    try {
      // Update a user by their id
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true }
      );

      // If no user is found, return a 404 error
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(`Error in updateUser: ${err.message}`);
      res.status(500).json({ error: 'Failed to update user' });
    }
  },
  
  async addFriend(req, res) {
    try {
      // Add a friend to a user's friend list
      const { userId, friendId } = req.params;
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      // If no user or friend is found, return a 404 error
      if (!user || !friend) {
        return res.status(404).json({ error: 'User or friend not found' });
      }

      // If the friend is already in the user's friend list, return a 400 error
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ error: 'Friend already added' });
      }

      // Add the friend to the user's friend list
      user.friends.push(friendId);
      await user.save();

      res.json({ message: 'Friend added successfully', user });
    } catch (err) {
      console.error(`Error in addFriend: ${err.message}`);
      res.status(500).json({ error: 'Failed to add friend' });
    }
  },
  
  async removeFriend(req, res) {
    try {
      // Remove a friend from a user's friend list
      const { userId, friendId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If the friend is not in the user's friend list, return a 400 error
      user.friends = user.friends.filter(friend => friend.toString() !== friendId);
      await user.save();

      // Return the user with the friend removed
      res.json({ message: 'Friend removed successfully', user });
    } catch (err) {
      console.error(`Error in removeFriend: ${err.message}`);
      res.status(500).json({ error: 'Failed to remove friend' });
    }
  }
};
