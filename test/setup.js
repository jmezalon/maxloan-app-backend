// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

// // Start an in-memory MongoDB server for testing
// const mongoServer = new MongoMemoryServer();

// before(async () => {
//   // Connect to the in-memory MongoDB server
//   const mongoUri = await mongoServer.getUri();
//   await mongoose.connect(mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   // Additional setup steps, if needed
//   // For example, seeding the database with test data
// });

// after(async () => {
//   // Disconnect from the in-memory MongoDB server and stop it
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// // You can also add any global setup or utility functions here
// global.setupSomeGlobalFunction = () => {
//   // ...
// };
