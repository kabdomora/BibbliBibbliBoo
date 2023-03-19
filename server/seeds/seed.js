const db = require('../config/connection');
const { Book } = require('../models');

const bookData = require('./bookData.json');

db.once('open', async () => {
  await Book.deleteMany({});

  const books = await Book.insertMany(bookData);

  console.log('Books seeded! 📚');
  process.exit(0);
});