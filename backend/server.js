const express = require("express");
const { connectDB, sequelize } = require("./config/database"); // Consolidated database imports
const Employee = require("./models/Employee"); // Import Employee model
const employeeRoutes = require("./routes/employeeRoutes");
const cors = require("cors");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Use the cors middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// API Routes
app.get("/", (req, res) => res.send("Backend is running...🎉🎉🎉🎉"));

// Function to start the server
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Sync the models with the database (create tables if they don't exist)
    await sequelize.sync({ force: false }); // Set `force: true` with caution (drops existing tables)

    console.log("Database connected and synced successfully");

    // Start the server
    const PORT = 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Exit with failure code
  }
};

//Initialising sequelize to check DB connection

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection is working properly.");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

//Main code starts here I guess :D

//Registering employeeRoutes to server.js

app.use("/api/employees", employeeRoutes); // Register employee routes
app.get("/", (req, res) => res.send("API is running"));

startServer(); // Initialize the server
