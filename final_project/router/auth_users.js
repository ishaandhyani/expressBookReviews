const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  return users.some(user => user.username === username);
};


const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      username: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username; // Assuming the username is stored in the 'username' property of the JWT payload

  // Check if user is logged in
  if (!username) {
    return res.status(401).json({message: "User not logged in"});
  }

  // Check if review is provided
  if (!review) {
    return res.status(400).json({message: "Review not provided"});
  }

  // Find the book with the given ISBN
  let book = books[isbn];

  // If the book doesn't exist, return a 404 error
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  // If the book exists, add or modify the review
  book.reviews[username] = review;

  return res.status(200).json({message: "Review successfully added/modified"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; 

  // Check if user is logged in
  if (!username) {
    return res.status(401).json({message: "User not logged in"});
  }

  // Find the book with the given ISBN
  let book = books[isbn];

  // If the book doesn't exist, return a 404 error
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  // If the user has not posted a review, return an error
  if (!book.reviews[username]) {
    return res.status(404).json({message: "No review by this user found"});
  }

  // Delete the review
  delete book.reviews[username];

  return res.status(200).json({message: "Review successfully deleted"});
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
