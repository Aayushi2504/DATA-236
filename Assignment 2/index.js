//import express module 
const express = require('express');
//create an express app
const  app = express();
//require express middleware body-parser
const bodyParser = require('body-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
        res.render('home', {
            books: books
        });
});

// Route to render the create book form
app.get('/create', (req, res) => {
    res.render('create');
});

// Route to handle creating a new book
app.post('/add-book', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).send('Title and Author are required');
    }
    const newBook = {
        BookID: (books.length + 1).toString(), // Generate a new ID
        Title: title,
        Author: author
    };
    books.push(newBook);
    res.redirect('/');
});

// Route to render the update book form
app.get('/update', (req, res) => {
    res.render('update');
});

// Route to handle updating a book
app.post('/update-book', (req, res) => {
    const { id, title, author } = req.body;
    const book = books.find(book => book.BookID === id);
    if (!book) {
        return res.status(404).send('Book not found');
    }
    book.Title = title;
    book.Author = author;
    res.redirect('/');
});

// Route to render the delete book form
app.get('/delete', (req, res) => {
    res.render('delete');
});

// Route to handle deleting a book
app.post('/delete-book', (req, res) => {
    const { id } = req.body;
    books = books.filter(book => book.BookID !== id);
    res.redirect('/');
});

app.listen(5000, function () {
    console.log("Server listening on port 5000");
});
