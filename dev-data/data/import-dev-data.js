/* eslint-disable */
const fs = require('fs');
const dotenv = require('dotenv');
require('colors');

// models
const Goal = require('../../models/Goal');
const User = require('../../models/User');

dotenv.config({ path: './config.env' });
const connectDB = require('../../config/db');

// database connection
connectDB();

// read JSON file
const goals = JSON.parse(fs.readFileSync(`${__dirname}/goals.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// import data int DB
const importData = async () => {
  try {
    await Goal.create(goals);
    await User.create(users, { validateBeforeSave: false });
    console.log(
      '👍👍👍👍👍👍👍👍 Data successfully loaded! 👍👍👍👍👍👍👍👍'.green.bold
    );
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

// delete all data from DB
const deleteData = async () => {
  try {
    console.log('😢😢 Goodbye Data...');
    await Goal.deleteMany();
    await User.deleteMany();
    console.log(
      'Data successfully deleted! To load sample data, run\n\n\t npm run sample\n\n'
        .blue.bold
    );
    process.exit();
  } catch (err) {
    console.log(
      '\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'
        .red.bold
    );
    console.log(err);
    process.exit();
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
