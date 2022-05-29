const mongoose = require('mongoose')
const { MONGO_TEST_SERVER } = process.env

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  runValidators: true,
};

if (MONGO_TEST_SERVER !== undefined) {
  mongoose.connect(MONGO_TEST_SERVER, mongooseOptions)
}
else {
  console.error(new Error('MONGO_TEST_SERVER not defined'))
}
