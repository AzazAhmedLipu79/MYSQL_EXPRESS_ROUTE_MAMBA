// Import the express module
const express = require("express");
// Import the blog controller module that contains the functions for handling blog requests
const {
  getBlogs,
  createBlog,
  deleteBlogById,
  updateBlogById,
  getBlogById,
  updateThumbsUp,
} = require("../Controller/blogController");

// Create a router object using the express.Router() method
const blogRouter = express.Router();

// Define a route handler for getting all blogs using a GET request to /
blogRouter.route("/").get(getBlogs);

// Define a route handler for creating a new blog using a POST request to /POST
blogRouter.route("/POST").post(createBlog);

// Define a route handler for updating the thumbsup of a blog by id using a PATCH request to /UPDATE_THUMBSUP/:id
blogRouter.route("/UPDATE_THUMBSUP/:id").patch(updateThumbsUp);

// Define a route handler for getting, updating or deleting a blog by id using a GET, PATCH or DELETE request to /:id
blogRouter
  .route("/:id")
  .get(getBlogById)
  .patch(updateBlogById)
  .delete(deleteBlogById);

// Export the router object
module.exports = blogRouter;
