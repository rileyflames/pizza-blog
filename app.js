// Import required modules
const express = require('express'); // Express framework for building web apps
const path = require('path');       // Node.js module for handling file paths
const fs = require('fs');           // Node.js module for file system operations

// Initialize the Express application
const app = express();

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));

// Set EJS as the template/view engine
app.set('view engine', 'ejs');

// Set the directory where view templates are stored
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Path to the JSON file where posts are stored
const postsFilePath = path.join(__dirname, 'data', 'posts.json');

// Function to read and parse posts from the JSON file
function getPosts() {
    const data = fs.readFileSync(postsFilePath, 'utf8'); // Read file as text
    return JSON.parse(data); // Convert JSON text to JavaScript object/array
}

// Route: Home page - shows all posts
app.get('/', (req, res) => {
    const posts = getPosts(); // Get all posts
    res.render('index', { posts }); // Render 'index.ejs' and pass posts to it
});

// Route: Show form to create a new post
app.get('/new', (req, res) => {
    res.render('new'); // Render 'new.ejs' (the form)
});

// Route: Handle form submission for new post
app.post('/new', (req, res) => {
    const posts = getPosts(); // Get current posts
    const { title, image, body } = req.body; // Get data from form

    // Create a new post object
    const newPost = {
        id: Date.now().toString(), // Unique ID based on current time
        title,
        image,
        body,
        date: new Date().toLocaleDateString() // Current date as string
    };

    posts.unshift(newPost); // Add new post to the beginning of the array
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2)); // Save posts back to file

    res.redirect('/'); // Redirect user to home page
});

// Route: Show a single post by its ID
app.get('/post/:id', (req, res) => {
    const posts = getPosts(); // Get all posts
    const post = posts.find(p => p.id === req.params.id); // Find post by ID

    if (!post) {
        return res.status(404).send('Post not found'); // If not found, send 404 error
    }

    res.render('post', { post }); // Render 'post.ejs' and pass the found post
});

// Set the port number for the server
const PORT = 3000;

// Start the server and listen for requests
app.listen(PORT, () => {
    console.log(`Pizza blog server is running on http://localhost:${PORT}`);
});
