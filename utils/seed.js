const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomName, getRandomThoughts } = require('./data');

// Connect to the database
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
connection.once('open', async () => {
  console.log('Connected to the database');

  try {
    // Delete existing users and thoughts before seeding
    await Thought.deleteMany();
    await User.deleteMany();
    console.log(14)

    // Create empty array to hold the users
    const users = [];
    console.log(18)

    // Loop 20 times -- add users to the users array
    for (let i = 0; i < 20; i++) {
      // Create a random username and email
      let username = getRandomName();
      const first = username.split(' ')[0];
      const last = username.split(' ')[1];
      const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;
      console.log(24) //error occuring here. Unable to seed data to database. "Path 'username' is required."

      const email = `${username.toLowerCase().replace(/\s/g, '')}@example.com`; // Remove spaces in the username for email

      users.push({ username, email });
    }

    // Create users in the database
    const createdUsers = await User.create(users);

    // Loop through each created user and generate random thoughts for them
    for (let i = 0; i < createdUsers.length; i++) {
      const newThoughts = getRandomThoughts(5); // Generating 5 random thoughts per user

      // Create thoughts in the database and associate them with the user
      const createdThoughts = await Thought.create(newThoughts);
      if (createdThoughts.length > 0) {
        const thoughtIds = createdThoughts.map(thought => thought._id);
        await User.findByIdAndUpdate(createdUsers[i]._id, { $push: { thoughts: thoughtIds } });
      } else {
        console.warn('No thoughts created for user:', createdUsers[i]._id);
      }
    }

    console.log('Seeding complete! 🌱');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    // Close the connection to the database
    connection.close();
  }
});
