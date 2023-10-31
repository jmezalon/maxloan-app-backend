// const mongoose = require("mongoose");

// const connectToTestDatabase = async () => {
//   // Connect to a test database
//   await mongoose.connect(process.env.TEST_DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// const disconnectFromTestDatabase = async () => {
//   // Disconnect from the test database
//   await mongoose.connection.close();
// };

// const clearTestDatabase = async () => {
//   // Clear all collections in the test database
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     await collections[key].deleteMany();
//   }
// };

// const jwt = require("jsonwebtoken");
// const { User } = require("../../app/models/User");

// const generateAuthToken = (userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "1h", // Token expires in 1 hour for testing
//   });
//   return token;
// };

// const createUserAndAuthenticate = async () => {
//   // Create a test user and generate an authentication token
//   const user = await User.create({
//     username: "testuser",
//     password: "testpassword",
//   });
//   const authToken = generateAuthToken(user._id);
//   return { user, authToken };
// };

// const axios = require("axios");

// const sendHttpRequest = async (method, url, data, headers) => {
//   try {
//     const response = await axios({
//       method,
//       url,
//       data,
//       headers,
//     });
//     return response.data;
//   } catch (error) {
//     return { error: error.message };
//   }
// };

// // const faker = require("faker");

// // const generateRandomUser = () => {
// //   return {
// //     username: faker.internet.userName(),
// //     email: faker.internet.email(),
// //     password: faker.internet.password(),
// //   };
// // };

// module.exports = {
//   connectToTestDatabase,
//   disconnectFromTestDatabase,
//   clearTestDatabase,
//   generateAuthToken,
//   createUserAndAuthenticate,
//   sendHttpRequest,
//   //   generateRandomUser,
// };
