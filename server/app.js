// Import required modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//const db = require("./config/database");

// Initialize express app
const app = express();

// Database connection setup
// db.connect(err => {
//     if (err) {
//         console.error("Database connection error:", err);
//     } else {
//         console.log("Successfully connected to the database.");
//     }
// });

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

// Set EJS as the view engine
app.set("view engine", "ejs");

// Static file serving for public assets (JS, CSS, Images)
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));

// Route setup for page routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/dash", require("./routes/dash"));
app.use("/account", require("./routes/account"));

// Add in 404 page
app.use((req, res, next) => {
    res.status(404).json({
        error: '404 Not Found',
        message: 'The resource you are looking for does not exist.',
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});
