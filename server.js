// Import the express module
const express = require("express");
// Import the blog router module
const blogRouter = require("./Router/blogRouter.js");
// Define the port number for the server
const PORT = 1010;
// Create an express app instance
const app = express();

// Use express.json() middleware to parse JSON data in the request body
app.use(express.json());

// Define a route handler for the root path that sends a welcome message
app.get("/", (req, res) => {
  res.send({ message: "Hello Blog" });
});
// Use the blog router for requests starting with /blogs
app.use("/blogs", blogRouter);

// Define the error handling middleware function that logs the error and sends a server error response
app.use((err, req, res, next) => {
  console.error(err); // Log the error
  res.status(500).send("Oops! Something broke!"); // Send a response
});

// Start the app on the specified port and log a message
app.listen(PORT, () => {
  console.log(`Server is running @ ${PORT}`);
});
