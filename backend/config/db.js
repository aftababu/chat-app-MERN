// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 5000,
//       autoIndex: true,
//       maxPoolSize: 10,
//       socketTimeoutMS: 45000,
//       family: 4,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected with server: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectDB;
