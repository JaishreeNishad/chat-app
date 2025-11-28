const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const io = require("socket.io")(8080, {
  cors: {
    origin: "http://localhost:5173",
  },
});
//connect db
require("./dp/connection");

//import files
const Users = require("./models/Users");
const Conversations = require("./models/Conversations");
const Messages = require("./models/Messages"); // Assuming this is your Mongoose model

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // **IMPORTANT: Add this to parse JSON body from Postman**

const port = process.env.PORT || 8000;

let users = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ADD USER
  socket.on("addUser", (userId) => {
    const exists = users.find((u) => u.userId === userId);

    if (!exists) {
      users.push({ userId, socketId: socket.id });
      console.log(users, "users list");
      io.emit("getUsers", users);
    }
  });

  // USER DISCONNECT
  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const receiver = users.find((u) => u.userId === receiverId);
      const sender = users.find((u) => u.userId === senderId);

      const user = await Users.findById(senderId);

      const payload = {
        senderId,
        message,
        conversationId,
        receiverId,
        user: { id: user._id, email: user.email, fullName: user.fullName },
      };

      // 👉 Send message to RECEIVER
      if (receiver) io.to(receiver.socketId).emit("getMessage", payload);

      // 👉 Send message to SENDER (real-time updates on your own screen)
      io.to(sender.socketId).emit("getMessage", payload);
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    users = users.filter((u) => u.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

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

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check for missing fields
    if (!email || !password) {
      // Use return to stop execution
      return res.status(400).send("Please fill all required field");
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).send("user email or password is incorrect");
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          return res.status(400).send("user email or password is incorrect");
        } else {
          const payload = { userId: user.id, email: user.email };
          const JWT_SECRET_KEY =
            process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";
          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: 84600 },
            async (err, token) => {
              await Users.updateOne(
                { _id: user._id },
                {
                  $set: { token },
                }
              );
              user.save();
              return res.status(200).json({
                user: {
                  id: user._id,
                  email: user.email,
                  fullName: user.fullName,
                },
                token: token,
              });
            }
          );
        }
      }
    }
  } catch (error) {
    console.log("Registration Error:", error);
  }
});

app.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversations({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    res.status(200).send("Conversation created successfully");
  } catch (error) {
    console.log(error, "error");
  }
});

app.get("/api/conversations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // get all conversations where the user is a member
    const conversations = await Conversations.find({
      members: { $in: [userId] },
    });

    // get data of the other user in each conversation
    const conversationUserData = Promise.all(
      conversations.map(async (conversation) => {
        const receiverId = conversation.members.find(
          (member) => member !== userId
        );
        const user = await Users.findById(receiverId);

        return {
          user: {
            receiverId: user._id,
            email: user.email,
            fullName: user.fullName,
          },
          conversationId: conversation._id,
        };
      })
    );

    res.status(200).json(await conversationUserData);
  } catch (error) {
    console.log("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    console.log(conversationId, senderId, message, receiverId);
    if (!senderId || !message)
      return res.status(400).send("please fill all required field");
    if (conversationId === "new" && receiverId) {
      const newConversation = new Conversations({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      const newMessage = new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).send("message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("please fill all required filed");
    }
    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message send successfully");
  } catch (error) {
    console.log(error, "error");
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      const messages = await Messages.find({ conversationId });
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          const user = await Users.findById(message.senderId);
          return {
            user: { id: user._id, email: user.email, fullName: user.fullName },
            message: message.message,
          };
        })
      );
      res.status(200).json(await messageUserData);
    };
    const conversationId = req.params.conversationId;
    if (conversationId === "new") {
      const checkConversation = await Conversations.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json([]);
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log(error, "error");
  }
});

app.get("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await Users.find({ _id: { $ne: userId } });
    const userData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await userData);
  } catch (error) {
    console.log(error, "error");
  }
});

app.listen(port, () => {
  console.log(`listing a post ${port}`);
});
