const mongoose = require("mongoose");
// **You must verify this exact string from your MongoDB Atlas Connect modal.**
// Correct format: username:password@clusterAddress.mongodb.net
const url = `mongodb+srv://chat_app_admin:admin12345@cluster3.njp8scb.mongodb.net/ChatApp?retryWrites=true&w=majority`;
//                                                                                 ^^^^^^^^
// Note the capital 'C' and 'A' in 'ChatApp'

mongoose
  .connect(url, {
    // The options below are often not required in modern Mongoose/Node drivers,
    // but they don't hurt and were in your original code.
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
