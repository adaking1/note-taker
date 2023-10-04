const express = require('express');
const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');
const {v4: uuid} = require('uuid');

const PORT = 3001;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// html routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'))
// });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});



// api routes
app.get('/api/notes', (req, res) => {
    fsp.readFile('./db/db.json')
    .then((data) =>  {
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {

    if (req.body) {
        const {title, text} = req.body;
        // const notes = [];
        const newNote = {title, text, "id":uuid()};

        fs.readFile('./db/db.json', (err, data) => {
            if (err) {
                console.log("error");
                res.errored(err);
            }
            else if (!data.includes("title")) {
                fsp.writeFile('./db/db.json', JSON.stringify([newNote]));
                res.json("new file");
            }
            else {
                const db = JSON.parse(data);
                        db.push(newNote);
                        console.log(db);
                        fsp.writeFile('./db/db.json', JSON.stringify(db));
                        res.json('Success');
            }
        })  
        
    }
    else {
        res.errored('Error');
    }
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})