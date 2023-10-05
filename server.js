const express = require('express');
const path = require('path');
const fsp = require('fs/promises');
const fs = require('fs');
const {v4: uuid} = require('uuid');
const db = './db/db.json';

const PORT = process.env.PORT || 3001;
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
    fsp.readFile(db)
    .then((data) =>  {
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {

    if (req.body) {
        const {title, text} = req.body;
        // const notes = [];
        const newNote = {title, text, "id":uuid()};

        fs.readFile(db, (err, data) => {
            if (err) {
                console.log("error");
                res.errored(err);
            }
            else if (!data.includes("title")) {
                fsp.writeFile(db, JSON.stringify([newNote]));
                res.json("new file");
            }
            else {
                const database = JSON.parse(data);
                        database.push(newNote);
                        console.log(database);
                        fsp.writeFile(db, JSON.stringify(database));
                        res.json('Success');
            }
        })  
        
    }
    else {
        res.errored('Error');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(db, (err, data) => {
        if (err) {
            res.errored(err);
        }
        else {
            let notes = JSON.parse(data);
            const {id} = req.params;
            console.log(id);
            notes = notes.filter((note) => note.id !== id);
            console.log(notes);
        }
    })
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});