const express = require('express');
const path = require('path');
const api = require('./routes/notes');

const PORT = process.env.PORT || 3001;
const app = express();

// these two lines are middleware for parsing JSON and url-endcoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this is middleware for accessing the static files in the 'public' folder
app.use(express.static('public'));
// this is middleware that grants access to the 'notes' file in the 'routes' folder
app.use('/api', api);

// html GET route for the homepage (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// html GET route for the notes page (notes.html)
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

// html GET route for any path not listed in the above html GET routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

// this is the eventListener that is listening for api calls on the user's port
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});