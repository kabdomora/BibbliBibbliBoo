const db = require('../config/connection');
const { Book } = require('../models');

const bookData = require('./bookData.json');
const userData = require('./userData.json');

db.once('open', async () => {
  await Book.deleteMany({});
  await User.deleteMany({});

  const books = await Book.insertMany(bookData);
  const users = await User.insertMany(userData);

  console.log('Books and Users seeded! 💃🕺📚');
  process.exit(0);
});