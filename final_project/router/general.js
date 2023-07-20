const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios=require('axios')


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(200).send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author=req.params.author;
  let authDetails = {"bookByAuthor":[]};

  for (let book in books) {
    if (books[book].author === author) {
      authDetails.bookByAuthor.push(books[book]);
    }
  }
  
  return res.status(200).send(authDetails);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title=req.params.title;
  let authDetails = {"bookByTitle":[]};

  for (let book in books) {
    if (books[book].title === title) {
      authDetails.bookByTitle.push(books[book]);
    }
  }
  
  return res.status(200).send(authDetails);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(200).send(books[req.params.isbn].reviews)
});

async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
async function getBookByIsbn() {
  try {
    const response = await axios.get(`http://localhost:5000/1`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

async function getBooksByAuthor() {
  try {
    const response = await axios.get(`http://localhost:5000/author/Chinua Achebe`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

async function getBooksByTitle() {
  try {
    const response = await axios.get(`http://localhost:5000/title/Things Fall Apart`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}




module.exports.general = public_users;
