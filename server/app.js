const express = require("express");
const bcryptjs = require("bcryptjs");
const app = express();

//connect db
require("./dp/connection");

//import files
const Users = require("./models/Users"); // Assuming this is your Mongoose model

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // **IMPORTANT: Add this to parse JSON body from Postman**

const port = process.env.PORT || 8000;

//app routes
app.get("/", (req, res) => {
  res.send("welcome!");
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check for missing fields
    if (!fullName || !email || !password) {
      // Use return to stop execution
      return res.status(400).send("Please fill all required field");
    }

    // 2. Check if user already exists
    // (Corrected findOne syntax)
    const isAlreadyExist = await Users.findOne({ email });

    if (isAlreadyExist) {
      return res.status(400).send("user already exist");
    }

    // 3. Hash the password
    // (Corrected bcryptjs.hash usage with await)
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 4. Create the new user object
    const newUser = new Users({
      fullName,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // 5. Save to database
    await newUser.save();

    // 6. Success response
    return res.status(200).send("user register sucessfully");
  } catch (error) {
    // FIX: Log the error and send a 500 status
    console.error("Registration Error:", error);
    return res
      .status(500)
      .send("Internal Server Error: Could not process registration.");
  }
});

app.listen(port, () => {
  console.log(`listing a post ${port}`);
});
