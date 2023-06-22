const { pool } = require("../Config/database");

// This function creates a new blog post in the database
// It takes the request and response objects as parameters
// It returns a promise that resolves with a success message and the blog id
// It rejects with an error that is passed to the next error handler middleware
const createBlog = async (req, res) => {
  // Get the title and content from the request body
  const { title, content } = req.body;
  // Check if the title and content are provided
  if (title && content) {
    try {
      // Create a query string that inserts a new record into the blog table with the title and content
      // Use placeholders (?) for the values and pass them as an array to prevent SQL injection
      const query = "INSERT INTO blog (title, content) VALUES(?, ?)";
      const values = [title, content];
      // Execute the query using the connection object and await for the result
      const result = await pool.query(query, values);
      // Send a success response with the blog id
      return res.status(201).json({
        success: true,
        blogId: result[0]?.insertId,
      });
    } catch (error) {
      // Handle any errors by passing them to the next error handler middleware
      return next(error);
    }
  } else {
    // Send a bad request response if the title or content is missing
    return res.status(400).json({
      message: "Title or content not found",
    });
  }
};

// This function gets all blog posts from the database
// It takes the request and response objects as parameters
// It returns a promise that resolves with a success message and the blog data
// It rejects with an error that is passed to the next error handler middleware
const getBlogs = async (req, res, next) => {
  try {
    // Create a query string that selects all records from the blog table
    const query = "SELECT * FROM blog";
    // Execute the query using the connection object and await for the result
    // The result is an array of objects that represent each blog post
    const blogs = await pool.query(query);
    // Send a success response with the blog data
    return res.status(200).json({
      success: true,
      data: blogs[0],
    });
  } catch (error) {
    // Handle any errors by passing them to the next error handler middleware
    return next(error);
  }
};

//-------------------------------------------------------------------------------------

const getBlogById = async (req, res) => {
  // Use req.params.id instead of req.params("id") to get the id from the route parameter
  const blogId = req.params.id;
  console.log(blogId);
  if (blogId) {
    try {
      const result = await pool.query(
        `SELECT * From blog
          WHERE id = ?;`,
        [blogId]
      );
      // Check if the result is empty or not, and send a 404 response if the blog is not found
      if (result[0].length === 0) {
        res.status(404).send({ message: "Blog Not Found" });
      } else {
        res.send({ success: true, data: result[0] });
      }
    } catch (error) {
      next(
        "Something went wrong when get blog data \n blogController.js line:64",
        error
      );
    }
  } else {
    // Use a consistent spelling of "No" in the error message
    res.status(400).send({
      message: "Id No Found \n blogController.js line:71",
    });
  }
};

//-------------------------------------------------------------------------------------
// This function updates a blog post in the database by its id
// It takes the request and response objects as parameters
// It returns a promise that resolves with a success message and the updated blog info
// It rejects with an error that is passed to the next error handler middleware
const updateBlogById = async (req, res, next) => {
  // Get the blog id from the request parameter
  const blogId = req.params.id;
  // Get the title and content from the request body
  const { title, content } = req.body;
  // Check if the title, content and blog id are provided
  if (title && content && blogId) {
    try {
      // Create a query string that updates the blog table with the new title and content where the id matches
      // Use placeholders (?) for the values and pass them as an array to prevent SQL injection
      const query = "UPDATE blog SET title = ?, content = ? WHERE id = ?";
      const values = [title, content, blogId];
      // Execute the query using the connection object and await for the result
      // The result is an object that contains information about the update operation
      const result = await pool.query(query, values);
      // Send a success response with the updated blog info
      return res.status(200).json({
        success: true,
        info: result[0],
      });
    } catch (error) {
      // Handle any errors by passing them to the next error handler middleware
      return next(error);
    }
  } else {
    // Send a bad request response if the title, content or blog id is missing
    return res.status(400).json({
      message: "Title, content or blog id not found",
    });
  }
};

//-------------------------------------------------------------------------------------

// This function deletes a blog record from the database by id
// It takes the request and response objects as parameters and returns a promise
const deleteBlogById = async (req, res, next) => {
  // Get the blog id from the request parameter
  const blogId = req.params.id;

  // Check if the blog id is provided
  if (blogId) {
    try {
      // Create a query string that deletes the blog record with the given id
      // Use placeholders (?) for the values and pass them as an array to prevent SQL injection
      const query = "DELETE FROM blog WHERE id = ?";
      const values = [blogId];
      // Execute the query using the connection object and await for the result
      const result = await pool.query(query, values);
      // Send a success response with the result
      return res.status(200).json({
        success: true,
        result: result,
      });
    } catch (error) {
      // Handle any errors by passing them to the next error handler middleware
      return next(error);
    }
  } else {
    // Send a bad request response if the blog id is missing
    return res.status(400).json({
      message: "Blog id not found",
    });
  }
};

//-------------------------------------------------------------------------------------

// This function updates the thumbsup column of a blog record in the database
// It takes the request and response objects as parameters and returns a promise
const updateThumbsUp = async (req, res) => {
  // Get the blog id from the request parameter
  const blogId = req.params.id;
  // Get the action from the request body (up or down)
  const action = req.body.action;
  // Check if the action is valid
  if (action === "UP" || action === "DOWN") {
    try {
      // Create a query string that updates the thumbsup column with the action
      // Use placeholders (?) for the values and pass them as an array to prevent SQL injection
      const query = "UPDATE blog SET thumbsup = thumbsup + ? WHERE id = ?";
      // Use 1 for up and -1 for down
      const value = action === "UP" ? 1 : -1;
      const values = [value, blogId];
      // Execute the query using the connection object and await for the result
      const result = await pool.query(query, values);
      // Send a success response with the result
      return res.status(200).json({
        message: "thumbsup updated successfully",
        result: result,
      });
    } catch (error) {
      // Handle any errors by sending a server error response with the error message
      return res.status(500).json({
        message: error.message,
      });
    }
  } else {
    // Send a bad request response if the action is invalid
    return res.status(400).json({
      message: "Invalid action",
    });
  }
};

//-------------------------------------------------------------------------------------

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  deleteBlogById,
  updateBlogById,
  updateThumbsUp,
};
